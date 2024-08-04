// Constants
const workerUrl = 'https://the-summarizer-worker.shant.workers.dev/'
const messageDisplayTime = 3000

// DOM Element Selectors
const textInputArea = document.getElementById('text-input-area')
const summaryLengthContainer = document.getElementById('summary-length-container')
const summaryLengthInput = document.getElementById('summary-length-input')
const summaryLengthText = document.getElementById('summary-length-text')
const summarizeBtn = document.getElementById('summarize-btn')
const summaryOutputSection = document.getElementById('summary-output-section')
const summaryContent = document.getElementById('summary-content')
const summaryOutputArea = document.getElementById('summary-output-area')
const copyBtn = document.getElementById('copy-btn')
const clearBtn = document.getElementById('clear-btn')
const loadingSection = document.getElementById('loading-section')
const errorSection = document.getElementById('error-section')
const errorMessage = document.getElementById('error-message')

// Event Listeners
document.addEventListener('DOMContentLoaded', focusOnLoad)
textInputArea.addEventListener('input', enableControls)
summaryLengthInput.addEventListener('input', updateSummaryLengthText)
summarizeBtn.addEventListener('click', summarize)
copyBtn.addEventListener('click', copy)
clearBtn.addEventListener('click', clear)

// Main Functions
async function summarize() {
    try {
        const summaryLength = summaryLengthInput.value
        const text = textInputArea.value
        const messages = [
            {
                'role': 'user',
                'content': [
                    {
                        'type': 'text',
                        'text': `You are a text summarizer. Take the following text and give me back a summary of it that is of length ${summaryLength} words. Just give me the text summary. Never say things like "here is the summary". If the text is gibberish, just return the word Gibberish. Here is the text: <text>${text}</text>`
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
        startLoading()
        const response = await fetch(workerUrl, options)
        endLoading()
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const summary = await response.json()
        summaryOutputArea.value = summary
        summaryOutputArea.disabled = false
        enableCopy()
        copyBtn.focus()
    } catch (err) {
        handleError(err)
    }
}

async function copy() {
    try {
        await navigator.clipboard.writeText(summaryOutputArea.value)
        showCopyFeedback('😄 Copied', 'success')
    } catch (err) {
        showCopyFeedback('😔 Failed', 'failure')
    }
}

function clear() {
    textInputArea.value = ''
    summaryOutputArea.value = ''
    textInputArea.focus()
    disableAllControls()
}

// UI Control Functions
function focusOnLoad() {
    textInputArea.focus()
}

function enableControls() {
    if (textInputArea.value.trim() !== '') {
        summaryLengthContainer.classList.remove('disabled')
        summaryLengthInput.disabled = false
        summarizeBtn.disabled = false
        clearBtn.disabled = false
    } else {
        disableAllControls()
    }
}

function disableAllControls() {
    summaryLengthContainer.classList.add('disabled')
    summaryLengthInput.disabled = true
    summarizeBtn.disabled = true
    summaryOutputArea.disabled = true
    clearBtn.disabled = true
    copyBtn.disabled = true
}

function enableCopy() {
    copyBtn.disabled = false
}

function updateSummaryLengthText() {
    summaryLengthText.textContent = `Summary Length: ${summaryLengthInput.value} Words`
}

// Helper Functions
function startLoading() {
    summaryContent.style.display = 'none'
    loadingSection.style.display = 'flex'
}

function endLoading() {
    loadingSection.style.display = 'none'
    summaryContent.style.display = 'flex'
}

function handleError(err) {
    endLoading()
    summaryContent.style.display = 'none'
    errorMessage.textContent = `There was an error processing the text: ${err}`
    errorSection.style.display = 'flex'
    setTimeout(() => {
        errorSection.style.display = 'none'
        summaryContent.style.display = 'flex'
    }, messageDisplayTime)
}

function showCopyFeedback(message, status) {
    const originalText = copyBtn.textContent
    const originalColor = copyBtn.style.backgroundColor

    copyBtn.textContent = message
    copyBtn.style.backgroundColor = status === 'success' ? 'lime' : 'indianred'
    copyBtn.setAttribute('aria-label', message)

    setTimeout(() => {
        copyBtn.textContent = originalText
        copyBtn.style.backgroundColor = originalColor
        copyBtn.removeAttribute('aria-label')
    }, messageDisplayTime)
}