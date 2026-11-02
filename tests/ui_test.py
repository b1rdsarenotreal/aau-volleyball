"""Browser test: python3 tests/ui_test.py [screenshot-dir]

Visits every page, enters a score by hand, plays a whole season through
selection (confirm, announce) and the Final Four, opens the offseason, and
checks that nothing errors and the phone layout doesn't scroll sideways.
"""
import http.server, socketserver, threading, sys, functools, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None
if OUT: OUT.mkdir(parents=True, exist_ok=True)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
U = f"http://127.0.0.1:{srv.server_address[1]}/index.html"
errors = []

def shot(pg, name):
    if OUT: pg.screenshot(path=str(OUT / f"{name}.png"), full_page=True)

def visit(pg, h, name=None):
    pg.goto(U + h); pg.wait_for_timeout(250)
    t = pg.locator("#app").inner_text()
    assert "Something went wrong" not in t, f"{h}: {t[:300]}"
    if name: shot(pg, name)
    return t

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1360, "height": 900})
    pg.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
    pg.on("console", lambda m: m.type == "error" and "ERR_" not in m.text and "fonts.g" not in m.text and errors.append(f"console: {m.text}"))
    pg.on("dialog", lambda d: d.accept())
    pg.goto(U); pg.wait_for_selector(".kpis")
    for h in ["#/home", "#/schedule", "#/standings", "#/rankings", "#/postseason", "#/teams", "#/coaches", "#/conferences", "#/history", "#/records", "#/settings", "#/team/Texas", "#/conference/Big%20Ten"]:
        visit(pg, h, "a-" + h.strip("#/").replace("/", "-").replace("%20", "_"))
    t = visit(pg, "#/teams")
    assert "ATK" in t and "SRV" in t and "OFF" not in t

    # Enter a score by hand: set scores, sets won worked out, a bad set refused.
    visit(pg, "#/schedule")
    pg.locator(".game[data-game]").first.click(); pg.wait_for_timeout(200)
    for side, vals in (("away", ["20", "25", "18", "23"]), ("home", ["25", "23", "25", "25"])):
        pg.click("#m-addinn") if side == "away" else None
        for i, v in enumerate(vals): pg.fill(f'input[data-side="{side}"][data-inn="{i}"]', v)
    pg.dispatch_event('input[data-side="home"][data-inn="3"]', "input")
    assert pg.locator("#m-home-R").inner_text() == "3" and pg.locator("#m-away-R").inner_text() == "1"
    shot(pg, "b-editor")
    pg.fill('input[data-side="home"][data-inn="3"]', "24"); pg.click("#m-save"); pg.wait_for_timeout(150)
    assert "isn't a finished set" in pg.locator("#toast").inner_text()
    pg.fill('input[data-side="home"][data-inn="3"]', "25"); pg.click("#m-save"); pg.wait_for_timeout(200)
    assert "saved" in pg.locator("#toast").inner_text()
    pg.locator(".game.final[data-game]").first.click(); pg.wait_for_timeout(200)
    assert "Sets" in pg.locator("dialog").inner_text()
    shot(pg, "b-box"); pg.keyboard.press("Escape")

    # Play the season; announce the field by hand.
    for _ in range(40):
        pg.goto(U + "#/home"); pg.wait_for_timeout(150)
        if pg.locator("#h-week").count():
            pg.click("#h-week"); pg.wait_for_timeout(500); continue
        pg.goto(U + "#/postseason"); pg.wait_for_timeout(200)
        if not pg.locator("#ps-all").count(): break
        if pg.locator('[data-pt="field"]').count(): pg.click('[data-pt="field"]'); pg.wait_for_timeout(200)
        if pg.locator("#f-confirm").count():
            shot(pg, "c-selection"); pg.click("#f-confirm"); pg.wait_for_timeout(300)
        if pg.locator("#f-lock").count():
            shot(pg, "c-seeding"); pg.click("#f-lock"); pg.wait_for_timeout(300)
        else:
            pg.click("#ps-all"); pg.wait_for_timeout(1500)
    t = visit(pg, "#/postseason")
    assert "National Champion" in t
    assert pg.locator('[data-pt="supers"]').count() == 0, "no super regionals with 4 regionals"
    for tab in ["regionals", "participants", "mcws"]:
        pg.click(f'[data-pt="{tab}"]'); pg.wait_for_timeout(250)
        assert "Something went wrong" not in pg.locator("#app").inner_text()
        shot(pg, f"d-{tab}")
    for h in ["#/home", "#/standings", "#/rankings", "#/team/Texas", "#/records", "#/history", "#/coaches", "#/offseason"]:
        visit(pg, h, "e-" + h.strip("#/").replace("/", "-"))
    t = visit(pg, "#/records")
    assert "Most kills in a match" in t and "Runs" not in t

    # Men's: a separate dynasty behind the switch; the women's one is kept.
    women_champ = pg.evaluate("() => document.querySelector('.banner .big')?.textContent || ''")
    visit(pg, "#/home")
    pg.click('#side-switch [data-side="men"]')
    pg.wait_for_function("document.getElementById('league-name').textContent === \"AAU Men's Volleyball\"", timeout=15000)
    t = visit(pg, "#/teams", "g-men-teams")
    assert "Penn State" in t and "Texas" not in t
    t = visit(pg, "#/conferences", "g-men-conferences")
    assert "Pacific Volleyball Federation" in t and "Eastern Volleyball Association" in t
    visit(pg, "#/schedule")
    pg.click("text=Sim rest of regular season"); pg.wait_for_timeout(1500)
    visit(pg, "#/postseason")
    pg.click("#ps-all"); pg.wait_for_timeout(1500)
    t = visit(pg, "#/postseason", "g-men-postseason")
    assert "National Champion" in t
    assert pg.locator('[data-pt="regionals"]').count() == 0, "no regionals for men"
    for h in ["#/home", "#/standings", "#/rankings", "#/records", "#/history", "#/settings"]:
        visit(pg, h, "g-men-" + h.strip("#/"))
    pg.click('#side-switch [data-side="women"]')
    pg.wait_for_function("document.getElementById('league-name').textContent === 'AAU Volleyball'", timeout=15000)
    t = visit(pg, "#/postseason")
    assert "National Champion" in t and (not women_champ or women_champ in t), "the women's dynasty is unchanged"

    pg.set_viewport_size({"width": 390, "height": 800})
    for h in ["#/home", "#/schedule", "#/standings"]:
        visit(pg, h)
        assert not pg.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1"), f"{h} scrolls sideways on a phone"
    shot(pg, "f-mobile")
    b.close()

srv.shutdown()
if errors:
    print("\n".join(errors)); sys.exit(1)
print("ui test passed")
