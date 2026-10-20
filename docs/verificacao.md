# Roteiro de verificação

## Verificação automatizada

```powershell
npm test
npm run build
```

O build rejeita dados sem fonte, coordenadas inválidas ou sem referência, categorias inexistentes, IDs duplicados e campanhas sem prazo.

## Navegador

1. Na página inicial, selecione Itu e Eletrônicos: dois registros documentados devem aparecer.
2. Combine Salto, Móveis e entulho e a busca `argelia 361`: apenas Jardim das Nações deve aparecer.
3. Selecione Tietê ou Cabreúva: o aviso deve explicar a ausência de dados. Use Limpar filtros para voltar.
4. Abra Mapa em Salto: somente Jardim Planalto deve ter marcador. Clique nele e confira o destaque do cartão. Sem coordenadas verificadas, os demais ficam apenas na lista.
5. Abra os detalhes e confira fonte, data, endereço e categorias. As rotas de quatro pontos devem usar o endereço completo; Jardim Planalto usa a coordenada documentada.
6. Recuse a localização: a busca precisa continuar funcionando. Quando permitir, a distância deve ser identificada como aproximada em linha reta.
7. Navegue pelas onze categorias, página institucional, privacidade e página inexistente.
8. Prepare uma sugestão ou relato. Campos inválidos devem ser recusados; o resultado deve permitir download ou cópia, sem afirmar que houve envio à equipe.
9. Prepare uma avaliação com “Não testei” e confira esse valor no arquivo JSON gerado.
10. Sem URL pública configurada, `/compartilhar` explica o requisito. Após configurá-la e recompilar, baixe e leia o QR com outro aparelho.
11. Teste a 320, 375, 768 e 1440 pixels: menu móvel, filtros, lista, mapa e formulários devem caber sem rolagem horizontal.
12. Navegue por Tab e ative os controles por teclado. O link “Ir para o conteúdo” deve ficar visível ao receber foco.
13. Na hospedagem, recarregue diretamente `/pontos/itu-sao-judas`; deve abrir a aplicação, confirmando o fallback das rotas.

## Antes de divulgação pública

Confirme com os responsáveis as informações de funcionamento que permanecem desconhecidas, revise as condições de entrega e complete o catálogo das cidades sem cobertura quando houver fontes suficientes. Cadastros fixos também podem mudar: mantenha a revisão documental periódica e a data de consulta correta.

O projeto não deve ser descrito como completo em cobertura territorial ou como serviço municipal oficial. Uma prévia privada não é a URL pública definitiva para o QR Code.
