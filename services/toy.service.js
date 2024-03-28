
import fs from 'fs'
import { utilService } from './util.service.js'
const toys = utilService.readJsonFile('data/toy.json')

export const toyService = {
    query,
    getById,
    save,
    remove
}

function query(filterBy, sortBy) {
    console.log(sortBy);
    let filteredToys = toys

    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        filteredToys = filteredToys.filter(toy => regex.test(toy.name))
    }
    if (filterBy.maxPrice) {
        filteredToys = filteredToys.filter(toy => toy.price < filterBy.maxPrice)
    }
    if (filterBy.inStock !== 'all') {
        filteredToys = filteredToys.filter(toy => (filterBy.inStock === 'inStock' ? toy.inStock : !toy.inStock))
    }

    if (sortBy.name) toys.sort((toy1, toy2) => (toy1.name.localeCompare(toy2.name)) * sortBy.name)
    if (sortBy.price) toys.sort((toy1, toy2) => (toy1.price - toy2.price) * sortBy.price)
    if (sortBy.created) toys.sort((toy1, toy2) => (toy1.created - toy2.created) * sortBy.created)

    return Promise.resolve(filteredToys)
}

function getById(_id) {
    const toy = toys.find(toy => toy._id === _id)
    return Promise.resolve(toy)
}

function remove(_id) {
    const idx = toys.findIndex(toy => toy._id === _id)
    toys.splice(idx, 1)
    _saveToysToFile()
    return Promise.resolve()
}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(currToy => currToy._id === toy._id)
        toys[idx] = { ...toys[idx], ...toy }
    } else {
        toy.createdAt = Date.now()
        toy._id = utilService.makeId()
        toys.unshift(toy)
    }
    _saveToysToFile()
    return Promise.resolve(toy)
}

function _saveToysToFile() {
    fs.writeFileSync('data/toy.json', JSON.stringify(toys, null, 2))
}
