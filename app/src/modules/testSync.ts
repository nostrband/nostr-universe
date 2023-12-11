export const blockingFunc = () => {
    const arr = new Array(100_000_000).map((elm, index) => elm + index)

    console.log('Rs blockingFunc: ', arr.length)
}