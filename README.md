# MyIoTProject (Smart Home IoT)

Aplicativo **React Native (Expo)** para monitoramento e controle de um ambiente IoT via **MQTT**.

- Assina tópicos para ler **temperatura** e **umidade**
- Controla o estado de uma **luz** publicando mensagens no tópico MQTT
- Interface simples com indicadores e histórico de mensagens

---

## Vídeo de demonstração

O vídeo de demonstraação do projeto está disponível no Google Drive:

- https://drive.google.com/file/d/1aB-wSznAUA6iG0F4WFApQU2RUR78WPaK/view?usp=sharing

---

## Stack / Tecnologias

- **JavaScript**
- **React Native**
- **Expo**
- **MQTT**

---

## Tópicos MQTT utilizados

Conforme o `App.js`, o app usa os seguintes tópicos:

- `casa/temp` → temperatura 
- `casa/umid` → umidade 
- `casa/luz` → estado da luz (`"1"` ligado / `"0"` desligado)

---

## Pré-requisitos

- Node.js + npm
- Expo (via `npx expo` ou Expo CLI)
- Um broker MQTT acessível (host, porta e credenciais)

---

## Configuração de ambiente (.env)

Existe um arquivo `.env.example` na raiz do projeto. Crie um arquivo `.env` baseado nele e preencha com os dados do seu broker MQTT.

Exemplo:

```dotenv
EXPO_PUBLIC_MQTT_HOST=SeuHost
EXPO_PUBLIC_MQTT_PORT=8883
EXPO_PUBLIC_MQTT_USERNAME=SeuUsuarioAqui
EXPO_PUBLIC_MQTT_PASS=SuaSenhaAqui
EXPO_PUBLIC_MQTT_PATH="/mqtt"
```

### Atenção (nome da variável de usuário)
No `App.js`, o código lê `EXPO_PUBLIC_MQTT_USER`, mas o `.env.example` usa `EXPO_PUBLIC_MQTT_USERNAME`.

Você pode resolver de um destes jeitos:

1. **Mais rápido:** no seu `.env`, use `EXPO_PUBLIC_MQTT_USER=...`  
   (mantendo o código como está)

ou

2. **Mais organizado:** altere o `App.js` para usar `EXPO_PUBLIC_MQTT_USERNAME`  
   (mantendo o `.env.example` como está)

---

## Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Inicie o projeto:

```bash
npx expo start (use --tunnel caso não esteja na mesma rede do computador)
```

---

## Estrutura (visão geral)

- `App.js` → tela principal (conexão MQTT, subscribe/publish e UI)
- `src/services/mqttService` → serviço de conexão MQTT
- `src/components/*` → componentes de UI (modal de status, controles, gauges, histórico)

---

## Licença

Este repositório não possui licença definida. Se quiser, adicione um arquivo `LICENSE`.
