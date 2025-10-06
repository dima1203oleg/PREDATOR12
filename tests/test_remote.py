"""Unit tests for the Piter Face remote controller."""

from __future__ import annotations

import unittest

from piterface import RemoteControl, RemoteSettings
from piterface import exceptions


class RemoteControlTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.remote = RemoteControl()

    def test_initial_state_is_off(self) -> None:
        state = self.remote.snapshot()
        self.assertFalse(state.is_on)
        self.assertEqual(state.current_channel, self.remote.settings.default_channel)
        self.assertEqual(state.volume, self.remote.settings.default_volume)
        self.assertFalse(state.muted)

    def test_power_on_resets_defaults(self) -> None:
        self.remote.power_on()
        self.remote.set_channel(10)
        self.remote.increase_volume(5)
        self.remote.power_off()
        self.remote.power_on()
        state = self.remote.snapshot()
        self.assertEqual(state.current_channel, self.remote.settings.default_channel)
        self.assertEqual(state.volume, self.remote.settings.default_volume)

    def test_channel_change_requires_power(self) -> None:
        with self.assertRaises(exceptions.RemoteStateError):
            self.remote.set_channel(5)

    def test_volume_change_requires_power(self) -> None:
        with self.assertRaises(exceptions.RemoteStateError):
            self.remote.increase_volume()

    def test_invalid_channel_raises(self) -> None:
        self.remote.power_on()
        with self.assertRaises(exceptions.RemoteStateError):
            self.remote.set_channel(self.remote.settings.max_channel + 1)

    def test_channel_wraps_next_previous(self) -> None:
        self.remote.power_on()
        self.remote.set_channel(self.remote.settings.max_channel)
        self.remote.next_channel()
        self.assertEqual(self.remote.current_channel, self.remote.settings.min_channel)
        self.remote.previous_channel()
        self.assertEqual(self.remote.current_channel, self.remote.settings.max_channel)

    def test_volume_limits_and_mute(self) -> None:
        self.remote.power_on()
        self.remote.increase_volume(500)
        self.assertEqual(self.remote.volume, self.remote.settings.max_volume)
        self.remote.decrease_volume(1000)
        self.assertEqual(self.remote.volume, self.remote.settings.min_volume)
        self.assertTrue(self.remote.muted)

    def test_mute_unmute_restores_volume(self) -> None:
        self.remote.power_on()
        self.remote.increase_volume(3)
        previous_volume = self.remote.volume
        self.remote.mute()
        self.assertTrue(self.remote.muted)
        self.assertEqual(self.remote.volume, 0)
        self.remote.unmute()
        self.assertFalse(self.remote.muted)
        self.assertEqual(self.remote.volume, previous_volume)

    def test_unmute_without_previous_volume_uses_default(self) -> None:
        self.remote.power_on()
        self.remote.mute()
        self.remote._previous_volume = None  # simulate manual reset
        self.remote.unmute()
        self.assertEqual(self.remote.volume, self.remote.settings.default_volume)

    def test_negative_volume_step_raises(self) -> None:
        self.remote.power_on()
        with self.assertRaises(exceptions.RemoteStateError):
            self.remote.increase_volume(-1)
        with self.assertRaises(exceptions.RemoteStateError):
            self.remote.decrease_volume(-1)


class RemoteSettingsTestCase(unittest.TestCase):
    def test_invalid_channel_range(self) -> None:
        with self.assertRaises(exceptions.RemoteValidationError):
            RemoteSettings(min_channel=10, max_channel=5)

    def test_default_channel_outside_range(self) -> None:
        with self.assertRaises(exceptions.RemoteValidationError):
            RemoteSettings(min_channel=1, max_channel=5, default_channel=10)

    def test_unknown_config_key(self) -> None:
        with self.assertRaises(exceptions.RemoteValidationError):
            RemoteSettings.from_mapping({"name": "Test", "unknown": 1})

    def test_from_mapping_valid(self) -> None:
        settings = RemoteSettings.from_mapping({
            "name": "Custom",
            "min_channel": 1,
            "max_channel": 10,
            "default_channel": 3,
            "min_volume": 0,
            "max_volume": 20,
            "default_volume": 5,
        })
        self.assertEqual(settings.name, "Custom")
        self.assertEqual(settings.default_channel, 3)
        self.assertEqual(settings.max_volume, 20)


if __name__ == "__main__":
    unittest.main()
