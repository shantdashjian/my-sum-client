// Constants
const workerUrl = 'https://the-summarizer-worker.shant.workers.dev/'
const feedbackDisplayTime = 5000

// Element Selectors
const textInputArea = document.getElementById('text-input-area')
const summaryLengthContainer = document.getElementById('summary-length-container')
const summaryLengthInput = document.getElementById('summary-length-input')
const summaryLengthText = document.getElementById('summary-length-text')
const summarizeButton = document.getElementById('summarize-button')
const summaryContent = document.getElementById('summary-content')
const summaryOutputArea = document.getElementById('summary-output-area')
const copyButton = document.getElementById('copy-button')
const clearButton = document.getElementById('clear-button')
const loadingSection = document.getElementById('loading-section')
const errorSection = document.getElementById('error-section')
const errorMessage = document.getElementById('error-message')
const dismissErrorButton = document.getElementById('dismiss-error-button')

// Button Event Listeners
summarizeButton.addEventListener('click', summarize)
copyButton.addEventListener('click', copy)
clearButton.addEventListener('click', clear)
dismissErrorButton.addEventListener('click', dismissError)

// Other Event Listeners
document.addEventListener('DOMContentLoaded', focusOnTextInputArea)
textInputArea.addEventListener('input', scrollTextAreaToTopAndEnableControls)
summaryLengthInput.addEventListener('input', updateSummaryLengthText)

// Button Event Handlers
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
                        'text': `You are a text summarizer. Take the following text and give me back a summary of it that is of length ${summaryLength} words. Just give me the text summary. Never say things like "here is the summary". If you don't understand what the text means, just return the word Gibberish. Here is the text: <text>${text}</text>`
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
        const summary = await response.json()
        if (!response.ok) {
            throw new Error(summary.error)
        }
        summaryOutputArea.value = summary
        enableSummayOutputArea()
        enableCopy()
        focusOnCopyButton()
    } catch (error) {
        handleError(error)
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
    clearTextInputArea()
    clearSummaryOutputArea()
    enableTextInputArea()
    focusOnTextInputArea()
    disableAllControls()
}

function dismissError() {
    hideErrorSection()
    displaySummaryContent()
    clear()
}

// Other Event Handlers
function focusOnTextInputArea() {
    textInputArea.focus()
}

function scrollTextAreaToTopAndEnableControls() {
    scrollTextAreaToTop()
    enableControls()
}

function updateSummaryLengthText() {
    summaryLengthText.textContent = `Summary Length: ${summaryLengthInput.value} Words`
}

// Helper Functions
function scrollTextAreaToTop() {
    setTimeout(() => {
        textInputArea.scrollTop = 0
    }, 0)
}

function enableControls() {
    if (textInputArea.value.trim() !== '') {
        enableSummaryLengthContainer()
        enableSummaryLengthInput()
        enableSummarizeButton()
        enableClearButton()
    } else {
        disableAllControls()
    }
}

function disableAllControls() {
    disableSummaryLengthContainer()
    disableSummaryLengthInput()
    disableSummarizeButton()
    disableSummaryOutputArea()
    disbaleClearButton()
    disableCopyButton()
}

function startLoading() {
    hideSummaryContent()
    displayLoadingSection()
}

function endLoading() {
    hideLoadingSection()
    displaySummaryContent()
}

function handleError(error) {
    endLoading()
    disableTextInputArea()
    disableAllControls()
    hideSummaryContent()
    setErrorMessageText(`There was an error processing the text: ${error.message}`)
    displayErrorSection()
}

function showCopyFeedback(message, status) {
    const feedbackClass = status === 'success' ? 'copied' : 'failed'
    addClassToCopyButton(feedbackClass)
    setCopyButtonText(message)
    setTimeout(() => {
        removeClassFromCopyButton(feedbackClass)
        setCopyButtonText('Copy')
    }, feedbackDisplayTime)
}

function focusOnCopyButton() {
    copyButton.focus()
}

function displaySummaryContent() {
    summaryContent.style.display = 'flex'
}

function displayLoadingSection() {
    loadingSection.style.display = 'flex'
}

function displayErrorSection() {
    errorSection.style.display = 'flex'
}

function hideLoadingSection() {
    loadingSection.style.display = 'none'
}

function hideErrorSection() {
    errorSection.style.display = 'none'
}

function hideSummaryContent() {
    summaryContent.style.display = 'none'
}

function enableTextInputArea() {
    textInputArea.disabled = false
}

function enableSummaryLengthContainer() {
    summaryLengthContainer.classList.remove('disabled')
}

function enableClearButton() {
    clearButton.disabled = false
}

function enableSummarizeButton() {
    summarizeButton.disabled = false
}

function enableSummaryLengthInput() {
    summaryLengthInput.disabled = false
}

function enableCopy() {
    copyButton.disabled = false
}

function enableSummayOutputArea() {
    summaryOutputArea.disabled = false
}

function disableCopyButton() {
    copyButton.disabled = true
}

function disbaleClearButton() {
    clearButton.disabled = true
}

function disableSummaryOutputArea() {
    summaryOutputArea.disabled = true
}

function disableSummarizeButton() {
    summarizeButton.disabled = true
}

function disableSummaryLengthInput() {
    summaryLengthInput.disabled = true
}

function disableSummaryLengthContainer() {
    summaryLengthContainer.classList.add('disabled')
}

function disableTextInputArea() {
    textInputArea.disabled = true
}

function setErrorMessageText(text) {
    errorMessage.textContent = text
}

function setCopyButtonText(text) {
    copyButton.textContent = text
}

function clearTextInputArea() {
    textInputArea.value = ''
}

function clearSummaryOutputArea() {
    summaryOutputArea.value = ''
}

function removeClassFromCopyButton(className) {
    copyButton.classList.remove(className)
}

function addClassToCopyButton(className) {
    copyButton.classList.add(className)
}