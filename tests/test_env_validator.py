import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import pytest

from scripts.env_validator import (
    ValidationResult,
    load_env_file,
    main,
    parse_env_lines,
    validate_env,
)


def test_parse_env_lines_strips_comments_and_quotes():
    content = [
        "# Comment should be ignored\n",
        "BOT_TOKEN=123:ABCDEF\n",
        "EMAIL_FROM=\"user@example.com\"\n",
        " EMPTY= value with spaces \n",
        "SHELL_EXPORT=value # inline comment should be part of value\n",
    ]

    result = parse_env_lines(content)

    assert result["BOT_TOKEN"] == "123:ABCDEF"
    assert result["EMAIL_FROM"] == "user@example.com"
    assert result["EMPTY"] == "value with spaces"
    assert result["SHELL_EXPORT"] == "value # inline comment should be part of value"


def test_parse_env_lines_rejects_invalid_line():
    with pytest.raises(ValueError):
        parse_env_lines(["not-a-valid-line"])


def test_validate_env_identifies_missing_and_invalid_values():
    env = {
        "BOT_TOKEN": "bad-token",
        "OWNER_ID": "not-digits",
        "TELEGRAM_TOKEN": "123:validTOKEN",
        "TELEGRAM_CHAT_ID": "123456",
        "EMAIL_FROM": "user@example",
        "EMAIL_TO": "other@example.com",
        "USE_POWERFUL_SERVERS_ONLY": "maybe",
        "MAX_GPU_USAGE": "1.2",
        "GROQ_API_KEY": "",
        "MISTRAL_API_KEY": "",
        "GEMINI_API_KEY": "",
    }

    result = validate_env(env)

    assert not result.is_valid
    assert "BOT_TOKEN має бути у форматі" in " ".join(result.errors)
    assert any("EMAIL_FROM" in error for error in result.errors)
    assert any("Порожні значення" in error for error in result.errors)


def test_validate_env_accepts_valid_configuration():
    env = {
        "BOT_TOKEN": "123456:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef",
        "OWNER_ID": "449035630",
        "TELEGRAM_TOKEN": "123456:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef",
        "TELEGRAM_CHAT_ID": "449035630",
        "EMAIL_FROM": "bot@example.com",
        "EMAIL_TO": "owner@example.com",
        "GROQ_API_KEY": "abc",
        "MISTRAL_API_KEY": "def",
        "GEMINI_API_KEY": "ghi",
        "USE_POWERFUL_SERVERS_ONLY": "true",
        "MAX_GPU_USAGE": "0.75",
    }

    result = validate_env(env)

    assert isinstance(result, ValidationResult)
    assert result.is_valid
    assert not result.errors
    assert not result.warnings


def test_load_env_file(tmp_path: pathlib.Path):
    env_path = tmp_path / "sample.env"
    env_path.write_text("BOT_TOKEN=1:token\n", encoding="utf-8")

    data = load_env_file(env_path)

    assert data == {"BOT_TOKEN": "1:token"}


def test_main_reports_missing_file(tmp_path: pathlib.Path, capsys: pytest.CaptureFixture[str]):
    missing_file = tmp_path / "missing.env"

    exit_code = main([str(missing_file)])

    captured = capsys.readouterr()
    assert exit_code == 2
    assert "не знайдено" in captured.err


def test_main_outputs_success(tmp_path: pathlib.Path, capsys: pytest.CaptureFixture[str]):
    env_path = tmp_path / "secrets.env"
    env_path.write_text(
        "BOT_TOKEN=123456:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef\n"
        "OWNER_ID=449035630\n"
        "TELEGRAM_TOKEN=123456:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef\n"
        "TELEGRAM_CHAT_ID=449035630\n"
        "EMAIL_FROM=bot@example.com\n"
        "EMAIL_TO=owner@example.com\n"
        "GROQ_API_KEY=abc\n"
        "MISTRAL_API_KEY=def\n"
        "GEMINI_API_KEY=ghi\n"
        "USE_POWERFUL_SERVERS_ONLY=true\n"
        "MAX_GPU_USAGE=0.5\n",
        encoding="utf-8",
    )

    exit_code = main([str(env_path)])

    captured = capsys.readouterr()
    assert exit_code == 0
    assert "Конфігурація валідна" in captured.out
