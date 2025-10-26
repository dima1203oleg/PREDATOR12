"""Core implementation of the Piter Face remote controller."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict

from .exceptions import RemoteStateError
from .settings import DEFAULT_SETTINGS, RemoteSettings


@dataclass(frozen=True)
class RemoteState:
    """A read-only snapshot of the remote controller state."""

    is_on: bool
    current_channel: int
    volume: int
    muted: bool

    def to_dict(self) -> Dict[str, int | bool]:
        """Return the state as a serialisable dictionary."""

        return {
            "is_on": self.is_on,
            "current_channel": self.current_channel,
            "volume": self.volume,
            "muted": self.muted,
        }


class RemoteControl:
    """Stateful representation of the "Piter Face" remote control."""

    def __init__(self, settings: RemoteSettings | None = None) -> None:
        self._settings = settings or DEFAULT_SETTINGS
        self._is_on = False
        self._current_channel = self._settings.default_channel
        self._volume = self._settings.default_volume
        self._muted = False
        self._previous_volume: int | None = None

    # ------------------------------------------------------------------
    # Power management
    # ------------------------------------------------------------------
    def power_on(self) -> None:
        """Turn the device on."""

        self._is_on = True
        self._muted = False
        self._previous_volume = None
        self._volume = self._settings.default_volume
        self._current_channel = self._settings.default_channel

    def power_off(self) -> None:
        """Turn the device off."""

        self._is_on = False
        self._muted = False
        self._previous_volume = None

    def toggle_power(self) -> None:
        """Toggle the power state of the device."""

        if self._is_on:
            self.power_off()
        else:
            self.power_on()

    # ------------------------------------------------------------------
    # Channel management
    # ------------------------------------------------------------------
    def set_channel(self, channel: int) -> None:
        """Change the channel to the provided value."""

        self._require_on()
        if not self._settings.min_channel <= channel <= self._settings.max_channel:
            raise RemoteStateError("Channel is outside of the allowed range.")
        self._current_channel = channel

    def next_channel(self) -> None:
        """Advance to the next channel, wrapping around if needed."""

        self._require_on()
        if self._current_channel >= self._settings.max_channel:
            self._current_channel = self._settings.min_channel
        else:
            self._current_channel += 1

    def previous_channel(self) -> None:
        """Go to the previous channel, wrapping around if needed."""

        self._require_on()
        if self._current_channel <= self._settings.min_channel:
            self._current_channel = self._settings.max_channel
        else:
            self._current_channel -= 1

    # ------------------------------------------------------------------
    # Volume management
    # ------------------------------------------------------------------
    def increase_volume(self, step: int = 1) -> None:
        """Increase the volume by ``step`` units."""

        self._require_on()
        if step < 0:
            raise RemoteStateError("Volume step must be non-negative.")
        self._volume = min(self._volume + step, self._settings.max_volume)
        if self._muted and self._volume > 0:
            self._muted = False
            self._previous_volume = None

    def decrease_volume(self, step: int = 1) -> None:
        """Decrease the volume by ``step`` units."""

        self._require_on()
        if step < 0:
            raise RemoteStateError("Volume step must be non-negative.")
        self._volume = max(self._volume - step, self._settings.min_volume)
        if self._volume == 0:
            self._muted = True
        else:
            self._muted = False
            self._previous_volume = None

    def mute(self) -> None:
        """Mute the device, remembering the previous volume."""

        self._require_on()
        if not self._muted:
            self._previous_volume = self._volume
            self._volume = 0
            self._muted = True

    def unmute(self) -> None:
        """Restore the volume after muting."""

        self._require_on()
        if self._muted:
            self._volume = (
                self._previous_volume
                if self._previous_volume is not None
                else self._settings.default_volume
            )
            self._muted = False
            self._previous_volume = None

    # ------------------------------------------------------------------
    # Introspection helpers
    # ------------------------------------------------------------------
    @property
    def is_on(self) -> bool:
        return self._is_on

    @property
    def current_channel(self) -> int:
        return self._current_channel

    @property
    def volume(self) -> int:
        return self._volume

    @property
    def muted(self) -> bool:
        return self._muted

    @property
    def settings(self) -> RemoteSettings:
        return self._settings

    def snapshot(self) -> RemoteState:
        """Return a snapshot of the current state."""

        return RemoteState(
            is_on=self._is_on,
            current_channel=self._current_channel,
            volume=self._volume,
            muted=self._muted,
        )

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------
    def _require_on(self) -> None:
        if not self._is_on:
            raise RemoteStateError("The device must be powered on to perform this action.")


__all__ = ["RemoteControl", "RemoteState"]
