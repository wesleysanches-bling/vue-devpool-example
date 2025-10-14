# Demonstração do Padrão Mediator com Vue 3 + TypeScript

Este projeto demonstra o padrão de design **Mediator** comparando duas abordagens de comunicação entre componentes Vue:

## 🎯 Objetivo

Comparar componentes **fortemente acoplados** (sem mediator) com componentes **desacoplados** (com mediator usando Pinia).

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── sem-mediator/          # Componentes fortemente acoplados
│   │   ├── AddToCartButton.vue
│   │   ├── ProductImage.vue
│   │   └── ProductOptions.vue
│   ├── com-mediator/          # Componentes desacoplados
│   │   ├── AddToCartButton.vue
│   │   ├── ProductImage.vue
│   │   └── ProductOptions.vue
│   ├── ProductPage_SemMediator.vue  # Pai com acoplamento forte
│   └── ProductPage_ComMediator.vue  # Pai desacoplado
├── stores/
│   └── productStore.ts        # Store Pinia (Mediator)
├── App.vue
└── main.ts
```

## 🚀 Como Executar

1. Instalar dependências:
```bash
npm install
```

2. Executar em modo desenvolvimento:
```bash
npm run dev
```

3. Compilar para produção:
```bash
npm run build
```

## 📚 Conceitos Demonstrados

### Sem Mediator (Acoplamento Forte)
- O componente pai centraliza toda a lógica
- Props drilling e event bubbling
- Difícil de manter e escalar
- Componentes altamente dependentes do pai

### Com Mediator (Desacoplado)
- Store Pinia centraliza o estado e a lógica
- Componentes independentes
- Fácil de manter e escalar
- Testável e reutilizável

## 🛠️ Tecnologias

- Vue 3
- TypeScript
- Pinia (State Management)
- Vite

## 📖 Aprendizado

Este projeto é ideal para entender:
- Padrões de design em aplicações Vue
- Gerenciamento de estado com Pinia
- Comunicação entre componentes
- Melhores práticas de arquitetura frontend

