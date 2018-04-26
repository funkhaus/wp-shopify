import refreshAll from './refreshAll'
import _get from 'lodash.get'

class WpsRefresh {
    constructor() {
        const form = document.getElementById('refresh')
        if (form.attachEvent) {
            form.attachEvent('submit', this.refreshProducts)
        } else {
            form.addEventListener('submit', this.refreshProducts)
        }
    }

    async refreshProducts(evt) {
        evt.preventDefault()

        const products = await refreshAll()

        console.log(products)
    }
}

document.addEventListener(
    'DOMContentLoaded',
    () => {
        new WpsRefresh()
    },
    false
)
