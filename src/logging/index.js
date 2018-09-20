// STROKE LOGGING
function logCanvasOperation (sketchId, operation, userId) {
  let fetchHeaders = new Headers()
  let fetchInit = {
    method: 'POST',
    headers: fetchHeaders,
    mode: 'cors',
    body: JSON.stringify({
      fields: {
        type: {
          stringValue: 'canvas-operation'
        },
        operation: {
          stringValue: operation
        },
        user: {
          stringValue: userId
        }
      }
    })
  }

  try {
    fetch(`https://firestore.googleapis.com/v1beta1/projects/ebauche-logging/databases/(default)/documents/${sketchId}?documentId=${Date.now()}`, fetchInit)
  } catch (e) {
    console.log(e)
  }
}

export default {
  logCanvasOperation: logCanvasOperation
}
