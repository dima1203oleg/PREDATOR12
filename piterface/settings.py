"""Configuration helpers for the Piter Face remote controller."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping

from .exceptions import RemoteValidationError


@dataclass(frozen=True)
class RemoteSettings:
    """Settings describing the capabilities of the remote controller."""

    name: str = "Piter Face"
    min_channel: int = 1
    max_channel: int = 999
    default_channel: int = 1
    min_volume: int = 0
    max_volume: int = 100
    default_volume: int = 10

    def __post_init__(self) -> None:
        if self.min_channel >= self.max_channel:
            raise RemoteValidationError(
                "The minimum channel must be smaller than the maximum channel."
            )
        if not self.min_channel <= self.default_channel <= self.max_channel:
            raise RemoteValidationError(
                "Default channel must be within the allowed channel range."
            )
        if self.min_volume >= self.max_volume:
            raise RemoteValidationError(
                "The minimum volume must be smaller than the maximum volume."
            )
        if not self.min_volume <= self.default_volume <= self.max_volume:
            raise RemoteValidationError(
                "Default volume must be within the allowed volume range."
            )

    @classmethod
    def from_mapping(cls, mapping: Mapping[str, Any]) -> "RemoteSettings":
        """Create settings from a mapping (e.g. JSON/YAML configuration)."""

        allowed_keys = {
            "name",
            "min_channel",
            "max_channel",
            "default_channel",
            "min_volume",
            "max_volume",
            "default_volume",
        }

        unknown_keys = set(mapping) - allowed_keys
        if unknown_keys:
            raise RemoteValidationError(
                f"Unknown configuration keys: {', '.join(sorted(unknown_keys))}"
            )

        return cls(**{key: mapping[key] for key in mapping if key in allowed_keys})


DEFAULT_SETTINGS = RemoteSettings()
"""Convenience instance used by :class:`~piterface.remote.RemoteControl`."""
