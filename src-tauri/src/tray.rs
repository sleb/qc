use anyhow::{Context, Result};
use tauri::{menu::MenuBuilder, AppHandle, Runtime};

pub fn create_tray<R: Runtime>(app: &AppHandle<R>) -> Result<()> {
    let menu = MenuBuilder::new(app).text("quit", "Quit").build()?;
    let tray = app
        .tray_by_id("tray")
        .context("couldn't find tray with id `tray`")?;
    tray.set_menu(Some(menu))?;
    tray.on_menu_event(|app, event| match event.id.as_ref() {
        "quit" => app.exit(0),
        _ => {}
    });

    Ok(())
}
