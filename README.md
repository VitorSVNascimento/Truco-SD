# Truco-SD
### Jogo de truco com inteface gráfica, com duplas jogando via rede(cada um em sua máquina)
## Proposta do Projeto
 Projeto de turma desenvolvido para a disciplina de Sistemas Distribuídos, lecionada pelo professor Rafael.
 <br>
 - O projeto consiste em:
   
   | | ÁREA | DESCRIÇÃO | |
   | --- | --- | --- | --- |
   || Interface Gráfica | A interface poderia ser uma aplicação desktop, web ou mobile. ||
   || Comunicação |  Comunicação remota (sockets, HTTP, Firebase, etc.). ||
   || Arquitetura | Cliente-servidor, P2P ou híbrida. ||
   || Recuperação de erros | Caso um dos usuários desconecte ou caia, a dupla perderá a partida, sendo contabilizado no placar. ||
   || Bots | Ter de 1 a 4 pessoas, onde se faltar jogadores seram subtituídos por bots simples. ||
   || Execução do Truco | - Exibição e manipulação das cartas; <br> - Nome dos jogadores/bots; <br> - Botão de chamar truco; <br> - Contabilização de pontos por jogador.<br> - Jogadores poderam jogar em máquinas diferentes ou iguais;<br> - Placar de contabilizar as vitórias de cada jogador; <br> - Comunicação entre os jogadores (via chat de texto ou via áudio.||
  
  ## Resultados do Projeto
   - A seguir apresentaremos algumas imagens e vídeo do jogo de truco funcionando.
   - Tela de login
     
     <img src="https://github.com/VitorSVNascimento/Truco-SD/blob/main/Imagens_Truco/tela_login_truco.jpeg" width="980px">

   - Tela do jogo.

     <img src="https://github.com/VitorSVNascimento/Truco-SD/blob/main/Imagens_Truco/jogo_truco.jpeg" width="980px">

   - A seguir temos um pequeno vídeo mostrando mais o funcionamento do jogo.
    
 https://github.com/VitorSVNascimento/Truco-SD/assets/129966396/87f69335-e553-477a-a5ce-60b9fc1a9d10


   - Caso queira saber mais sobre o funcionamento do nosso jogo de truco clique no link a seguir para ser direcionado para o nosso site de apresentação: [Site de Apresentaçãp](https://vitorsvnascimento.github.io/Truco-SD-Site-Apresentacao/)

  ## Um pouco mais sobre o densenvolvimento do Projeto (Parte mais técnica)
   - Na tabela a seguir será feita a exblicação de como resolvemos os requisitos mencionados na Proposta do projeto.
     
      | | ÁREA | DESCRIÇÃO | |
      | --- | --- | --- | --- |
      || Interface Gráfica | Resolvemos fazer a interface web utilizando: <br> - TailwindCSS<br> -Shadcn/ui<br> - Vite <br>- React <br> Para a utilização da interface siga os passos descritos neste link: [FrontEnd](https://github.com/VitorSVNascimento/Truco-SD/tree/main/frontend) ||
      || Comunicação | A comunicação foi feita através de socketsIO. ||
      || Arquitetura | A arquitetura escolhida foi Cliente-servidor. ||
      || Recuperação de erros | FrontEnd e BackEnd trataram a possível desconexão dos jogadores. ||
      || Bots | Foram feitos os bots com possíbilidade de vários nomes diferentes, eles avaliam as chances de ter uma carta na mão que possa ganhar a partida. ||
      || Execução do Truco | Tanto a parte de frontEnd quanto a de BackEnd foram realizadas conforme os requisitos solicitados acima, criamos vários eventos que ajudam na execução do jogo (criação, sala de espera, truco, ganhadores, bots, dentro outros). ||

  ## Colaboradores do Projeto
   - A seguir a tabela contém um link para o repositório de todos os colaboradores desse projeto.

      || NOME | LINK DO  GITHUB ||
      | --- | --- | --- | --- |
      || João Lucas | https://github.com/ja1za1 ||
      || Letícia Oliveira | https://github.com/LeticiaKOSilva ||
      || Vinícius José | https://github.com/ViniciusJPSilva ||
      || Vitor Samuel | https://github.com/VitorSVNascimento ||
      || Vitor Silvestre | https://github.com/VitorST1 ||
