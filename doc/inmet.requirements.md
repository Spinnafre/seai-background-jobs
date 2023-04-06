### Comportamento esperado

- Extrair dados das requisições da página https://mapas.inmet.gov.br/#

- Listar todos os parâmetros (medições) disponíveis na página

- Filtrar parâmetros por apenas medições necessárias

- Realizar iteração por cada parâmetro de busca usando campos necessários e realizando a requisição

- Pegar dados de cada requisição e ir montando em uma estrutura de dados associando a o código da estação

- Filtrar dados somente de estações do Ceará

- Salvar dados prontos para serem persistidos

### Verificações

- Verificar status da conexão com o sistema da INMET

- Caso a página do INMET tiver com problemas terá que agendar uma nova extração da página para um período de 5 minutos

- Entidade deve ser o INMET

- Região deve ser Nordeste

- Data deve ser do dia anterior

- Tipo de dados deve ser diário

- Só deve trazer dados de estações automáticas

- Deve verificar os códigos de cada parâmetro de medições filtrados

- Buscar e concatenar dados relacionados a estação e suas medições conforme os parâmetros solicitados

- Caso não haver dados de alguma das medições, deverá haver uma sinalização de que não foi possível extrair dados de tal estação e no fim irá deixar valores como nulos.

- Se não conseguir obter dados da página, deverá avisar que tal operação não foi possível ser realizada

### Critérios de aceitação

- Script deve avisar quando houver erros operacionais, não operacionais e também erros de conexão

- Script deve tentar pelo menos 3 vezes realizar operações caso der problemas de conexões com a fonte (portal do INMET)

- Deve haver testes automáticos para saber se o script ainda está válido tendo em vista o risco de haver modificações no sistema em que irá ser buscado as informações via scrapper.
