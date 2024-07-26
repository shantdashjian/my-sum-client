const summarizeBtnEl = document.getElementById("summarize-btn")
const textInputAreaEl = document.getElementById("text-input-area")
const summaryOutputAreaEl = document.getElementById("summary-output-area")
const rangeInputEl = document.getElementById("range-input")
const summarySizeTexEl = document.getElementById("summary-size-text")
const copyBtnEl = document.getElementById("copy-btn")
const clearBtnEl = document.getElementById("clear-btn")

let size = 20 
summarizeBtnEl.addEventListener('click', summarize)
rangeInputEl.addEventListener('input', updateSize)
copyBtnEl.addEventListener('click', copy)
clearBtnEl.addEventListener('click', clear)

async function summarize() {
  try {
    const text = textInputAreaEl.value
    const messages = [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": `You are a text summarizer. Take the following text and give me back a summary of it that is of length ${size} words. Just give me the summary. Here is the text: <text>${text}</text>`
              }
            ]
          }
        ]
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messages)
    }

    const response = await fetch('https://my-sum-worker.shant.workers.dev/', options)
    const summary = await response.json()
    summaryOutputAreaEl.value = summary
  } catch(err) {
    console.log(err)
  }
  
}

function updateSize() {
  size = rangeInputEl.value
  summarySizeTexEl.textContent = `Summary Size: ${size} Words`
}

function copy() {
  navigator.clipboard.writeText(summaryOutputAreaEl.value)
}

function clear() {
  textInputAreaEl.value = ''
  summaryOutputAreaEl.value = ''
}

