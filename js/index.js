$(document).ready(function() {
  const buildError = function(errorMessage) {
    if(! $(".error").length) {
      $("button").after("<span class='error'>" + errorMessage + "</span>");
    } else {
      $(".error").text(errorMessage);
    }
  };

  const buildTableRow = function(acc, artist) {
    var imgSrc = '/infoSec/styles/img/cantFind.jpg';//default image
    imgSrc = artist.images[artist.images.length-1] ? artist.images[artist.images.length-1].url : imgSrc;
    const row = `<tr><td>${artist.name}</td><td><img src="${imgSrc}"></td><td><a rel="noopener noreferrer" target="_blank" href="${artist.external_urls.spotify}">${artist.external_urls.spotify}</a></td></tr>`;
    return acc + row;
  };

  const parseGenres = function(acc, artist) {
    artist.genres.forEach(function(genre) {
      acc[genre] = !isNaN(acc[genre]) ? (acc[genre] + 1) : 1;
    });
    return acc;
  };

  const buildGenres = function(genres) {
    var html = ''
    Object.keys(genres).forEach(function(genre){
      html = html + `<div class="genre"><span class="genreText">${genre} x${genres[genre]}</span></div>`
    });
    return html;
  };

  const compare = function(artist1, artist2){
    if(artist1.name < artist2.name) return -1;//Sorts alphabetically first
    if(artist1.name > artist2.name) return 1;
    if(artist1.popularity > artist2.popularity) return -1;//Then by Pop
    if(artist1.popularity < artist2.popularity) return 1;
    //the above only works due to the nature of the sorting function used
    return 0;
  }

  $("#artistNameForm").submit(function(event) {
    var data = {name: $("#artistNameInput").val()}
    $.post("/infoSec/php/api.php", data)
      .done(function(data) {
        data = JSON.parse(data);
        if(data.success) {
          $('.error').remove();

          data.artists = JSON.parse(data.artists).artists;

          if(data.artists.items.length){
            data.artists.items.sort(compare);

            var tabelData = data.artists.items.reduce(buildTableRow, '');
            $('#informationTable tr').not(':first').remove();
            $('#informationTable tr').first().after(tabelData);

            var genres = data.artists.items.reduce(parseGenres, {});
            genres = buildGenres(genres);
            if($(".genre").length) {
              $(".genre").remove();
            }
            $('#informationTable').after(genres);

          } else {
            buildError("There was no artist of that name found");
          }

        } else {
          buildError(data.errors.message);
        }
      })
      .fail(function(data) {
        buildError("There was a network error");
      }
    );

    event.preventDefault();
  });
});
