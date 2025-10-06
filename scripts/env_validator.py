"""Tools for validating ``.env`` style configuration files.

This module focuses on the requirements implied by the historic
``telegram-bot/secrets.env`` file that used to live in the repository.  The
functions provide reusable helpers that can be imported in tests or called from
other tooling, while :func:`main` exposes a tiny CLI so the validation can be
triggered manually.
"""
from __future__ import annotations

from dataclasses import dataclass
import pathlib
import re
import sys
from typing import Iterable, Mapping, Sequence

_ENV_LINE_RE = re.compile(r"^(?P<key>[A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?P<value>.*)$")
_TOKEN_RE = re.compile(r"^[0-9]+:[A-Za-z0-9_-]{30,}$")
_EMAIL_RE = re.compile(r"^[A-Za-z0-9_.+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


@dataclass(frozen=True)
class ValidationResult:
    """Container describing the outcome of a validation run.

    Attributes
    ----------
    errors:
        A tuple with all discovered validation errors.  The tuple is empty when
        the input satisfies every rule.
    warnings:
        A tuple with soft issues that are worth surfacing but should not break
        the execution.
    """

    errors: tuple[str, ...]
    warnings: tuple[str, ...] = ()

    @property
    def is_valid(self) -> bool:
        """Return ``True`` when no errors were discovered."""

        return not self.errors


def parse_env_lines(lines: Iterable[str]) -> dict[str, str]:
    """Parse lines from a ``.env`` style file into a dictionary.

    Parameters
    ----------
    lines:
        Iterable with the raw lines.  ``\n`` characters are stripped for the
        caller.

    Returns
    -------
    dict[str, str]
        Mapping with the parsed key/value pairs.  Duplicate keys keep the last
        value (mimicking how operating systems behave when ``source``-ing a
        shell file).

    Notes
    -----
    Comment lines and blank lines are ignored.  Values wrapped in matching
    single or double quotes are unwrapped, while surrounding whitespace is
    stripped from both keys and values.
    """

    result: dict[str, str] = {}
    for raw_line in lines:
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        match = _ENV_LINE_RE.match(line)
        if not match:
            raise ValueError(f"Malformed line: {raw_line!r}")

        key = match.group("key").strip()
        value = match.group("value").strip()
        if value and value[0] in {'"', "'"} and value[-1] == value[0]:
            value = value[1:-1]

        result[key] = value
    return result


def validate_env(
    data: Mapping[str, str],
    required_keys: Sequence[str] | None = None,
) -> ValidationResult:
    """Validate configuration for the historical Telegram bot.

    Parameters
    ----------
    data:
        Mapping with the configuration values.
    required_keys:
        Optional list of required keys.  When omitted the canonical list from
        ``secrets.env`` is used.
    """

    if required_keys is None:
        required_keys = (
            "BOT_TOKEN",
            "OWNER_ID",
            "TELEGRAM_TOKEN",
            "TELEGRAM_CHAT_ID",
            "EMAIL_FROM",
            "EMAIL_TO",
            "GROQ_API_KEY",
            "MISTRAL_API_KEY",
            "GEMINI_API_KEY",
            "USE_POWERFUL_SERVERS_ONLY",
            "MAX_GPU_USAGE",
        )

    errors: list[str] = []
    warnings: list[str] = []

    missing_keys = [key for key in required_keys if key not in data]
    if missing_keys:
        errors.append(
            "Відсутні обов'язкові ключі: " + ", ".join(sorted(missing_keys))
        )

    empty_keys = [
        key for key in required_keys if key in data and not data[key].strip()
    ]
    if empty_keys:
        errors.append(
            "Порожні значення для ключів: " + ", ".join(sorted(empty_keys))
        )

    if (token := data.get("BOT_TOKEN")) and not _TOKEN_RE.match(token):
        errors.append("BOT_TOKEN має бути у форматі <digits>:<token>")
    if (token := data.get("TELEGRAM_TOKEN")) and not _TOKEN_RE.match(token):
        errors.append("TELEGRAM_TOKEN має бути у форматі <digits>:<token>")

    if (owner_id := data.get("OWNER_ID")) and not owner_id.isdigit():
        errors.append("OWNER_ID має містити лише цифри")
    if (chat_id := data.get("TELEGRAM_CHAT_ID")) and not chat_id.isdigit():
        errors.append("TELEGRAM_CHAT_ID має містити лише цифри")

    for key in ("EMAIL_FROM", "EMAIL_TO"):
        if email := data.get(key):
            if not _EMAIL_RE.match(email):
                errors.append(f"{key} містить некоректну адресу: {email}")

    if (use_powerful := data.get("USE_POWERFUL_SERVERS_ONLY")):
        normalized = use_powerful.lower()
        if normalized not in {"true", "false"}:
            errors.append(
                "USE_POWERFUL_SERVERS_ONLY має бути true або false (у будь-якому регістрі)"
            )
        elif normalized == "false":
            warnings.append(
                "Рекомендовано залишати USE_POWERFUL_SERVERS_ONLY=true для чутливих ботів"
            )

    if (gpu_usage := data.get("MAX_GPU_USAGE")):
        try:
            value = float(gpu_usage)
        except ValueError:
            errors.append("MAX_GPU_USAGE має бути числом")
        else:
            if not (0.0 <= value <= 1.0):
                errors.append("MAX_GPU_USAGE має бути в межах [0.0, 1.0]")
            elif value > 0.9:
                warnings.append(
                    "MAX_GPU_USAGE > 0.9 може призвести до перевантаження ресурсів"
                )

    return ValidationResult(tuple(errors), tuple(warnings))


def load_env_file(path: pathlib.Path) -> dict[str, str]:
    """Load and parse a ``.env`` style file."""

    with path.open("r", encoding="utf-8") as handle:
        return parse_env_lines(handle)


def main(argv: Sequence[str] | None = None) -> int:
    """Entry point used by the ``python -m`` runner."""

    if argv is None:
        argv = sys.argv[1:]

    path = pathlib.Path(argv[0]) if argv else pathlib.Path("telegram-bot/secrets.env")
    if not path.exists():
        print(f"Файл {path} не знайдено", file=sys.stderr)
        return 2

    try:
        data = load_env_file(path)
    except ValueError as exc:  # pragma: no cover - defensive branch
        print(f"Помилка читання файлу: {exc}", file=sys.stderr)
        return 3

    result = validate_env(data)
    if result.errors:
        print("Конфігурація містить помилки:", file=sys.stderr)
        for error in result.errors:
            print(f" - {error}", file=sys.stderr)
        return 1

    if result.warnings:
        print("Попередження:")
        for warning in result.warnings:
            print(f" - {warning}")

    print("Конфігурація валідна")
    return 0


if __name__ == "__main__":  # pragma: no cover - manual invocation helper
    raise SystemExit(main())
