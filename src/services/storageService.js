import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mqtt_history';
const MAX_MESSAGES = 500;

class StorageService {
  async saveMessage(topic, message) {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      let history = data ? JSON.parse(data) : [];

      const newMessage = {
        id: Date.now(),
        topic,
        message,
        timestamp: new Date().toISOString(),
      };

      history.push(newMessage);

      if (history.length > MAX_MESSAGES) {
        history = history.slice(-MAX_MESSAGES);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    }
  }

  async getHistory(limit = 50) {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      let history = data ? JSON.parse(data) : [];

      if (limit && limit > 0) {
        history = history.slice(-limit);
      }

      return history.reverse();
    } catch (error) {
      console.error('Erro ao recuperar histórico:', error);
      return [];
    }
  }

  async getHistoryByTopic(topic, limit = 50) {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      let history = data ? JSON.parse(data) : [];

      history = history.filter((msg) => msg.topic === topic);

      if (limit && limit > 0) {
        history = history.slice(-limit);
      }

      return history.reverse();
    } catch (error) {
      console.error('Erro ao recuperar histórico por tópico:', error);
      return [];
    }
  }

  async clearHistory() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  }

  async getHistoryCount() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const history = data ? JSON.parse(data) : [];
      return history.length;
    } catch (error) {
      console.error('Erro ao contar mensagens:', error);
      return 0;
    }
  }
}

export default new StorageService();
