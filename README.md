# Consulta de CEP

Uma aplicação elegante e moderna para buscar, visualizar e gerenciar endereços brasileiros através do CEP.

## 📋 Funcionalidades

### Busca de CEP
- Consulta de endereços através da API ViaCEP
- Preenchimento automático dos campos de endereço
- Validação de CEP
- Indicação visual da fonte dos dados (API, cache ou endereço salvo)

### Armazenamento Local
- Suporte a dois tipos de armazenamento:
  - **LocalStorage**: Armazenamento simples baseado em chave-valor
  - **IndexedDB**: Banco de dados mais robusto para armazenamento de grandes volumes de dados
- Alternância fácil entre os métodos de armazenamento
- Fallback automático para LocalStorage em caso de erro no IndexedDB

### Gerenciamento de Endereços
- Salvar endereços para uso futuro
- Visualizar lista de endereços salvos
- Definir endereços como "Casa" ou "Trabalho"
- Excluir endereços
- Ícones personalizados para cada tipo de endereço

### Cache Inteligente
- Armazenamento em cache de CEPs consultados
- Expiração automática do cache após 24 horas
- Visualização das entradas em cache com idade
- Opção para limpar o cache

### Visualização em Mapa
- Exibição do endereço em um mapa interativo
- Integração com OpenStreetMap
- Marcador de localização
- Carregamento dinâmico do mapa

## 🛠️ Tecnologias Utilizadas

- **React**: Biblioteca para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Next.js**: Framework React para aplicações web
- **TailwindCSS**: Framework CSS utilitário
- **Leaflet**: Biblioteca para mapas interativos
- **LocalStorage**: API de armazenamento do navegador
- **IndexedDB**: API de banco de dados do navegador
- **ViaCEP API**: API pública para consulta de CEPs brasileiros

## 🚀 Como Usar

### Buscar um CEP
1. Digite o CEP no campo de busca (formato: 00000-000)
2. Clique no botão de busca ou pressione Tab
3. Os campos de endereço serão preenchidos automaticamente
4. Edite os campos se necessário
5. Clique em "Salvar Endereço"

### Gerenciar Endereços Salvos
- **Definir como Casa/Trabalho**: Passe o mouse sobre um endereço e selecione a opção desejada
- **Remover Definição**: Passe o mouse sobre um endereço com definição e selecione "Remover definição"
- **Excluir Endereço**: Passe o mouse sobre um endereço e clique em "Excluir endereço"

### Alternar Método de Armazenamento
- Clique em "LocalStorage" ou "IndexedDB" no painel lateral para alternar entre os métodos

### Gerenciar Cache
- Visualize as entradas em cache clicando em "Cache de CEPs"
- Limpe o cache clicando em "Limpar Cache"

### Link do deploy :
- https://busca-ce-ps.vercel.app/

# 📥 Instalação e Uso do Projeto

## 🚀 Pré-requisitos
Antes de começar, certifique-se de que possui os seguintes requisitos instalados:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes do Node.js)
- **Git** (para clonar o repositório)

## 📌 Clonando o Repositório
Para obter o código-fonte do projeto, execute o seguinte comando no terminal:

```sh
# Clone o repositório
git clone https://github.com/zinhocoder/Busca-CEPs.git

# Acesse a pasta do projeto
cd Busca-CEPs
```

## 📦 Instalando Dependências
Após clonar o projeto, instale as dependências necessárias com um dos seguintes comandos:

```sh
# Usando npm
npm install

# Ou usando yarn
yarn install
```

## ▶️ Executando o Projeto
Com as dependências instaladas, inicie o servidor de desenvolvimento:

```sh
# Usando npm
npm run dev

# Ou usando yarn
yarn dev
```

O projeto estará disponível no navegador em: **http://localhost:3000**

## 🏗️ Build para Produção
Para gerar os arquivos otimizados para produção, utilize o seguinte comando:

```sh
# Usando npm
npm run build

# Ou usando yarn
yarn build
```

Após a build, você pode executar o projeto em modo de produção com:

```sh
npm run start
# ou
yarn start
```

## 🛠️ Configuração Adicional
Se necessário, crie um arquivo **.env.local** na raiz do projeto para definir variáveis de ambiente. Por exemplo:

```env
NEXT_PUBLIC_API_URL=https://viacep.com.br/ws/
```

## 📝 Estrutura do Projeto
```plaintext
📦 busca-cep
├── 📁 public         # Arquivos estáticos
├── 📁 src
│   ├── 📁 components # Componentes reutilizáveis
│   ├── 📁 pages      # Páginas do Next.js
│   ├── 📁 styles     # Estilos com TailwindCSS
│   ├── 📁 utils      # Funções auxiliares
├── .gitignore        # Arquivos ignorados pelo Git
├── package.json      # Configuração do projeto e dependências
├── README.md         # Documentação principal
```

## 🔄 Atualizando o Projeto
Caso já tenha o repositório clonado e queira obter as últimas atualizações, execute:

```sh
# Navegue até a pasta do projeto
cd busca-cep

# Baixe as atualizações mais recentes
git pull origin main
```

## 🛑 Como Parar a Aplicação
Se precisar interromper a execução do servidor de desenvolvimento, pressione **Ctrl + C** no terminal onde ele está rodando.

---

Agora você está pronto para usar o projeto! 🚀


