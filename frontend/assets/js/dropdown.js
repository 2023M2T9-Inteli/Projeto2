document.addEventListener('DOMContentLoaded', function () {
    var dropdown = document.getElementById('grupo');
    var grupos = document.getElementsByClassName('content');
  
    // Função para exibir apenas as divs correspondentes ao valor selecionado
    function mostrarDivs() {
      var grupoSelecionado = dropdown.value;
  
      for (var i = 0; i < grupos.length; i++) {
        if (grupos[i].id === grupoSelecionado) {
          grupos[i].style.display = 'block';
        } else {
          grupos[i].style.display = 'none';
        }
      }
    }
  
    // Chama a função para exibir as divs iniciais
    mostrarDivs();
  
    // Adiciona um evento de alteração ao elemento 'dropdown'
    dropdown.addEventListener('change', mostrarDivs);
  });
  