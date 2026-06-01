import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import StorageService from '../services/storageService';

export default function MessageHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadHistory = async () => {
    const data = await StorageService.getHistory(50);
    setHistory(data);
    setLoading(false);
  };

  const handleClearHistory = async () => {
    await StorageService.clearHistory();
    setHistory([]);
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTopicColor = (topic) => {
    const colors = {
      'casa/temp': '#FF6B6B',
      'casa/umid': '#4ECDC4',
      'casa/luz': '#FFE66D',
    };
    return colors[topic] || '#A0A0A0';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Histórico de Mensagens</Text>
        <Text style={styles.count}>{history.length} mensagens</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma mensagem recebida ainda</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.messageItem}>
              <View
                style={[
                  styles.topicTag,
                  { backgroundColor: getTopicColor(item.topic) },
                ]}
              >
                <Text style={styles.topicText}>{item.topic}</Text>
              </View>
              <View style={styles.messageContent}>
                <Text style={styles.messageValue}>{item.message}</Text>
                <Text style={styles.timestamp}>
                  {formatTimestamp(item.timestamp)}
                </Text>
              </View>
            </View>
          )}
          scrollEnabled={true}
          style={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClearHistory}
        disabled={history.length === 0}
      >
        <Text style={styles.clearButtonText}>🗑️ Limpar Histórico</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  count: {
    color: '#888',
    fontSize: 12,
  },
  list: {
    maxHeight: 300,
    marginBottom: 15,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#252525',
    marginBottom: 8,
    borderRadius: 8,
    gap: 10,
  },
  topicTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 70,
  },
  topicText: {
    color: '#000',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageContent: {
    flex: 1,
  },
  messageValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    color: '#999',
    fontSize: 11,
    marginTop: 2,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
