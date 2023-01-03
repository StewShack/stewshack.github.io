new gridjs.Grid({
    columns: [{
        name: "Date (YYYY.MM.DD)",
        sort: { enabled: true },
        width: "30%"
        }, 
        {
        name: "Title",
        sort: { enabled: true },
        width: "50%",
        }, 
        {
        name: "Tags",
        sort: { enabled: true },
        width: "20%"
        }],
    data: [
      ["2018.11.19", "<a href=\"brew.htm\">Home Brewing Beer</a>", "Life"]
    ],
    search: {
        enabled: true
    },
    sort: {
        multiColumn: false,
        enabled: true
    },
    pagination: {
        enabled: true,
        limit: 50,
        summary: false
      }
  }).render(document.getElementById("articles-grid"));