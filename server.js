require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { AzureOpenAI } = require("openai");
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;
const dataDirectory = path.join(__dirname, 'data');

// 確保 ./data 目錄存在
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory);
}
const getHistoryFilePath = (chatId) => path.join(dataDirectory, `chatHistory_${chatId}.json`);
const sidebarFilePath = path.join(__dirname, 'sidebarContent.json');

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-05-01-preview";
const deployment = "hstmimicllm"; // Adapt based on your actual deployment
const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });



// 檢查並創建文件（如果不存在）
const ensureFileExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
  }
};

// 加載指定聊天室的聊天記錄
const loadChatHistory = (chatId) => {
  const historyFilePath = getHistoryFilePath(chatId);
  ensureFileExists(historyFilePath); // 確保文件存在
  const data = fs.readFileSync(historyFilePath, 'utf8');
  return JSON.parse(data);
};

// 保存指定聊天室的聊天記錄
const saveChatHistory = (chatId, history) => {
  const historyFilePath = getHistoryFilePath(chatId);
  fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2), 'utf8');
};

// 加載側邊欄內容
const loadSidebarContent = () => {
  ensureFileExists(sidebarFilePath); // 確保文件存在
  const data = fs.readFileSync(sidebarFilePath, 'utf8');
  return JSON.parse(data);
};

// 保存側邊欄內容
const saveSidebarContent = (content) => {
  fs.writeFileSync(sidebarFilePath, JSON.stringify(content, null, 2), 'utf8');
};

// 根據聊天室 ID 獲取聊天記錄
app.get('/chat/history/:chatId', (req, res) => {
  const { chatId } = req.params;
  const history = loadChatHistory(chatId);
  console.log(chatId)
  res.json(history);
});

// 接收訊息並發送給 OpenAI API
app.post('/chat', async (req, res) => {
  const { chatId, messages } = req.body;
  lastMessage = messages[messages.length - 1];
  console.log(lastMessage)
  try {
    const result = await client.chat.completions.create({
      messages,
      model: ""
    });

    const chatGPTResponse = result.choices[0].message.content;
    const newMessage = { id: messages.length + 1, text: chatGPTResponse, type: 'other', avatar: '' };
    const updatedMessages = [...messages, { role: 'system', content: chatGPTResponse }];
    saveChatHistory(chatId, updatedMessages);
    res.json({ message: chatGPTResponse, type: 'other' });
  } catch (error) {
    console.error('Error calling Azure OpenAI API:', error);
    res.status(500).json({ error: 'Failed to fetch response from Azure OpenAI' });
  }
});

// 獲取側邊欄內容
app.get('/sidebar', (req, res) => {
  try {
    console.log('GET /sidebar');
    const content = loadSidebarContent();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load sidebar content' });
  }
});

// 保存側邊欄內容
app.post('/sidebar', (req, res) => {
  try {
    console.log('POST /sidebar', req.body);
    const content = req.body;
    saveSidebarContent(content);
    res.status(200).json({ message: 'Sidebar content saved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save sidebar content' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});