use std::fs;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AiRequest {
    pub prompt: String,
    pub code_context: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct AiResponse {
    pub reply: String,
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn save_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn ask_qwen(request: AiRequest) -> Result<AiResponse, String> {
    println!("Получен запрос к Qwen: {}", request.prompt);
    std::thread::sleep(std::time::Duration::from_millis(500));

    let context = request.code_context.unwrap_or_default();
    let reply = format!(
        "Qwen Ассистент: Я проанализировал ваш код.\n\nДлина контекста: {} символов.\nРекомендация: код выглядит чисто, но рассмотрите добавление типизации.", 
        context.len()
    );

    Ok(AiResponse { reply })
}
