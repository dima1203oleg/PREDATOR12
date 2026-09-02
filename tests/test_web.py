import pytest

from piterface.web import create_app


@pytest.fixture()
def client():
    app = create_app({"TESTING": True, "SECRET_KEY": "test-key"})
    return app.test_client()


def test_index_is_accessible_and_secured(client):
    response = client.get("/")
    assert response.status_code == 200
    assert 'lang="uk"' in response.text
    assert "Головний телевізор" in response.text
    assert response.headers["Content-Security-Policy"].startswith("default-src 'self'")
    assert response.headers["X-Frame-Options"] == "DENY"


def test_health_check(client):
    assert client.get("/healthz").json == {"status": "ok"}


def test_complete_user_journey_is_persisted(client):
    assert client.get("/api/state").json == {
        "current_channel": 1,
        "is_on": False,
        "muted": False,
        "volume": 10,
    }
    assert client.post("/api/actions/channel-next").status_code == 409
    assert client.post("/api/actions/power").json["is_on"] is True
    assert (
        client.post("/api/actions/set-channel", json={"channel": 42}).json[
            "current_channel"
        ]
        == 42
    )
    assert client.post("/api/actions/volume-up").json["volume"] == 11
    assert client.post("/api/actions/mute").json["muted"] is True
    restored = client.post("/api/actions/unmute").json
    assert restored["muted"] is False
    assert restored["volume"] == 11
    assert client.get("/api/state").json == restored


@pytest.mark.parametrize("value", [None, True, 1.5, "2", [], {}])
def test_set_channel_rejects_non_integer_values(client, value):
    client.post("/api/actions/power")
    response = client.post("/api/actions/set-channel", json={"channel": value})
    assert response.status_code == 400


@pytest.mark.parametrize("channel", [0, 1000])
def test_set_channel_rejects_out_of_range_values(client, channel):
    client.post("/api/actions/power")
    response = client.post("/api/actions/set-channel", json={"channel": channel})
    assert response.status_code == 409


def test_unknown_action_returns_not_found(client):
    response = client.post("/api/actions/not-real")
    assert response.status_code == 404
    assert response.json == {"error": "Невідома дія."}


def test_production_requires_explicit_secret(monkeypatch):
    monkeypatch.setenv("PITERFACE_ENV", "production")
    monkeypatch.delenv("PITERFACE_SECRET_KEY", raising=False)
    with pytest.raises(RuntimeError, match="PITERFACE_SECRET_KEY"):
        create_app()
