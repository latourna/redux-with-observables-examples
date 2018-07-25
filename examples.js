const { createStore } = require('redux')
const { from: observableFrom } = require('rxjs')
const $$observable = require('symbol-observable').default

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}

const store = createStore(todos, ['Use Observables'])
const storeObservable$ = store[$$observable]() // see https://github.com/tc39/proposal-observable

// Subscribe directly to TC39 Observable
storeObservable$.subscribe({
  next: (state) => {
    console.log(`${state} | TC39 Observable`)
  },
})

// Convert TC39 Observable to RxJS Observable
const storeRxjsObservable$ = observableFrom(storeObservable$)
storeRxjsObservable$.subscribe((state) => {
  console.log(`${state} | RxJS Observable from store TC39 Observable`)
})

/**
 * Convert store to RxJS Observable (exact same result than previous example)
 * It works because observableFrom will call [$$observable]() on the object
 * passed in parameter just as we did line 15.
 * https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/subscribeToObservable.ts#L10
 * Probably the more elegant way to do it if you want tu use RxJS.
 */
const storeRxjsObservable2$ = observableFrom(store)
storeRxjsObservable2$.subscribe((state) => {
  console.log(`${state} | RxJS Observable from store`)
})

store.dispatch({
  type: 'ADD_TODO',
  text: 'Learn RxJS'
})
