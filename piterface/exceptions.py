"""Custom exception hierarchy for the Piter Face remote controller."""


class RemoteError(Exception):
    """Base exception for remote control errors."""


class RemoteValidationError(RemoteError):
    """Raised when the configuration of the remote is invalid."""


class RemoteStateError(RemoteError):
    """Raised when an operation is not allowed in the current state."""
