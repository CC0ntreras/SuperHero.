$(document).ready(function () {
    $('button').on('click', function (event) {
      var $miInput = $('#miInput'); 
      var valorInput = $miInput.val();
      var esNumero = $.isNumeric(valorInput);
  
      if (!esNumero) {
        $('#error').text('Por favor, ingrese un número válido.');
        return; 
      } else {
        $('#error').text(''); 
      }
  
      var apiUrl = 'https://superheroapi.com/api.php/10231560101926245/' + valorInput;
  
      $.ajax({
        type: 'GET',

// Usa el proxy CORS
        url: apiUrl, 

// Espera una respuesta en JSON
        dataType: 'json', 
        Headers: { 'Access-Control-Allow-Origin': '*' },
        success: function (data) {
          if (!data || data.response !== 'success') {
            $('#errorMessage').text('No se encontraron datos del héroe.');
            $('#errorContainer').show();
            $('#hero').hide();
            return;
          }

// Actualiza la imagen y los detalles
          $('#heroImage').attr('src', data.image.url).attr('alt', data.name);
          $('#heroName').text('Nombre: ' + data.name);
          var connectionsText = 'Conexiones:';
          if (
            data.connections['group-affiliation'] &&
            data.connections['group-affiliation'] !== 'None'
          ) {
            connectionsText += ' ' + data.connections['group-affiliation'];
          } else {
            connectionsText += '\n\tNo hay afiliaciones de grupo disponibles.';
          }
          $('#conexiones').text(connectionsText);
          $('#publicado').text('\tPublicado por: ' + data.biography.publisher);
          $('#ocupacion').text('Ocupación: ' + data.work.occupation);
          $('#primeraaparicion').text(
            'Primera aparición: ' + data.biography['first-appearance']
          );
          $('#altura').text('Altura: ' + data.appearance.height.join(', '));
          $('#peso').text('Peso: ' + data.appearance.weight.join(', '));
          $('#alias').text('Alias: ' + data.biography.aliases);
          // Genera el gráfico de CanvasJS para los powerstats
          generateChart(
            data.powerstats,
            'Estadísticas de Poder para ' + data.name
          );
  
          $('#hero').show();
          $('#errorContainer').hide();
        },
        error: function (xhr, status, error) {
          $('#errorMessage').text('Error al obtener datos del héroe: ' + error);
          $('#errorContainer').show();
  
          $('#hero').hide();
        },
      });
    });
    function generateChart(powerstats, name) {
      var chart = new CanvasJS.Chart('powerstatsChart', {
        type: 'doughnut',
        startAngle: 40,
  
        animationEnabled: true,
        title: {
          text: name,
        },
        data: [
          {
            type: 'doughnut',
            showInLegend: true,
            legendText: '{label}',
            indexLabel: '{label}: {y}',
            dataPoints: [
              {
                y: parseInt(
                  powerstats.intelligence !== 'null'
                    ? powerstats.intelligence
                    : 0,
                  10
                ),
                label: 'Inteligencia',
              },
              {
                y: parseInt(
                  powerstats.strength !== 'null' ? powerstats.strength : 0,
                  10
                ),
                label: 'Fuerza',
              },
              {
                y: parseInt(
                  powerstats.speed !== 'null' ? powerstats.speed : 0,
                  10
                ),
                label: 'Velocidad',
              },
              {
                y: parseInt(
                  powerstats.durability !== 'null' ? powerstats.durability : 0,
                  10
                ),
                label: 'Resistencia',
              },
              {
                y: parseInt(
                  powerstats.power !== 'null' ? powerstats.power : 0,
                  10
                ),
                label: 'Poder',
              },
              {
                y: parseInt(
                  powerstats.combat !== 'null' ? powerstats.combat : 0,
                  10
                ),
                label: 'Combate',
              },
            ],
          },
        ],
      });
      chart.render();
    }
  });
  