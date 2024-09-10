use anyhow::{Context, Result};
use log::debug;
use tauri::{AppHandle, Manager, Runtime};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

pub fn create_shortcut<R: Runtime>(app: &AppHandle<R>) -> Result<()> {
    let global_shortcut = Shortcut::new(
        Some(Modifiers::SHIFT.union(Modifiers::SUPER)),
        tauri_plugin_global_shortcut::Code::KeyV,
    );

    app.plugin(
        tauri_plugin_global_shortcut::Builder::new()
            .with_handler(move |handle, shortcut, event| {
                debug!("global shortcut: `{:?}`", shortcut);
                if shortcut == &global_shortcut {
                    match event.state() {
                        ShortcutState::Pressed => {
                            let window = handle
                                .get_webview_window("main")
                                .context("couldn't find webview for `main`")
                                .unwrap();
                            if window.is_visible().unwrap() {
                                window.hide().unwrap();
                            } else {
                                window.show().unwrap();
                                window.set_focus().unwrap();
                            }
                        }
                        _ => {}
                    }
                }
            })
            .build(),
    )?;

    app.global_shortcut().register(global_shortcut)?;

    Ok(())
}
