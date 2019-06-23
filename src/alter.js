module.exports = (
  sources = {
    head: null,
    style: null,
    body: null,
    script: null
  }
) =>
  `\t\t<form id='edit' name='edit' method='post' action='https://localhost:3443/'>
\t\t\t<input type='submit' />
${Object.entries(sources)
  .map(entry =>
    entry[0] !== "filepath"
      ? `\t\t\t<span class='label'>${
          entry[0]
        }</span><textarea cols='40' name='${
          entry[0]
        }'>${entry[1].trim()}</textarea>`
      : ""
  )
  .join("\n")}
\t\t</form>`;
