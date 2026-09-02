"""HTTP interface for the Piter Face remote controller."""

from __future__ import annotations

import os
from typing import Any

from flask import Flask, jsonify, render_template, request, session

from .exceptions import RemoteStateError
from .remote import RemoteControl

_SESSION_KEY = "remote_state"
_ACTIONS = {
    "power": "toggle_power",
    "channel-next": "next_channel",
    "channel-previous": "previous_channel",
    "channel-last": "last_channel",
    "volume-up": "increase_volume",
    "volume-down": "decrease_volume",
    "mute": "mute",
    "unmute": "unmute",
}


def _restore_remote() -> RemoteControl:
    """Restore a controller from the signed client session."""

    remote = RemoteControl()
    state = session.get(_SESSION_KEY)
    if not isinstance(state, dict):
        return remote

    # Session data is signed but still validated defensively before restoration.
    is_on = state.get("is_on")
    channel = state.get("current_channel")
    volume = state.get("volume")
    muted = state.get("muted")
    previous_channel = state.get("previous_channel")
    previous_volume = state.get("previous_volume")
    if not isinstance(is_on, bool) or not isinstance(muted, bool):
        return remote
    if not isinstance(channel, int) or not isinstance(volume, int):
        return remote
    if not remote.settings.min_channel <= channel <= remote.settings.max_channel:
        return remote
    if not remote.settings.min_volume <= volume <= remote.settings.max_volume:
        return remote

    remote._is_on = is_on
    remote._current_channel = channel
    remote._volume = volume
    remote._muted = muted
    remote._previous_channel = (
        previous_channel if isinstance(previous_channel, int) else None
    )
    remote._previous_volume = (
        previous_volume if isinstance(previous_volume, int) else None
    )
    return remote


def _save_remote(remote: RemoteControl) -> dict[str, Any]:
    state = remote.snapshot().to_dict()
    session[_SESSION_KEY] = {
        **state,
        "previous_channel": remote._previous_channel,
        "previous_volume": remote._previous_volume,
    }
    return state


def create_app(config: dict[str, Any] | None = None) -> Flask:
    """Create and configure the Flask application."""

    environment = os.environ.get("PITERFACE_ENV", "development")
    secret_key = os.environ.get("PITERFACE_SECRET_KEY")
    if environment == "production" and not secret_key and not config:
        raise RuntimeError(
            "PITERFACE_SECRET_KEY must be configured in the production environment."
        )

    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY=secret_key or "development-only-key",
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=os.environ.get("PITERFACE_COOKIE_SECURE") == "1",
        MAX_CONTENT_LENGTH=16 * 1024,
    )
    if config:
        app.config.update(config)

    @app.after_request
    def security_headers(response: Any) -> Any:
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; style-src 'self'; script-src 'self'; "
            "img-src 'self' data:; object-src 'none'; frame-ancestors 'none'; "
            "base-uri 'self'; form-action 'self'"
        )
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        return response

    @app.get("/")
    def index() -> str:
        return render_template("index.html")

    @app.get("/api/state")
    def get_state() -> Any:
        return jsonify(_restore_remote().snapshot().to_dict())

    @app.post("/api/actions/<action>")
    def perform_action(action: str) -> Any:
        remote = _restore_remote()
        try:
            if action == "set-channel":
                payload = request.get_json(silent=True)
                channel = payload.get("channel") if isinstance(payload, dict) else None
                if isinstance(channel, bool) or not isinstance(channel, int):
                    return jsonify(error="Вкажіть цілий номер каналу."), 400
                remote.set_channel(channel)
            elif action in _ACTIONS:
                getattr(remote, _ACTIONS[action])()
            else:
                return jsonify(error="Невідома дія."), 404
        except RemoteStateError as exc:
            return jsonify(error=str(exc)), 409

        return jsonify(_save_remote(remote))

    @app.get("/healthz")
    def health() -> Any:
        return jsonify(status="ok")

    return app


def main() -> None:
    """Run the development server for local use."""

    create_app().run(
        host=os.environ.get("HOST", "127.0.0.1"),
        port=int(os.environ.get("PORT", "8000")),
        debug=False,
    )


if __name__ == "__main__":
    main()
