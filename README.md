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

