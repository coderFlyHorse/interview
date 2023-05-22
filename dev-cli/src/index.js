const a = 'Hello ITEM'
import '@/main.css';
import '@/sass.scss'
import logo from '../public/logo.jpg'
const img = new Image()
img.src = logo

document.getElementById('imgBox').appendChild(img)
console.log(a)
class Author {
    name = 'ITEM'
    age = 18
    email = 'lxp_work@163.com'

    info = () => {
        return {
            name: this.name,
            age: this.age,
            email: this.email
        }
    }
}

console.log("移除console.log,因为会导致内存溢出");


module.exports = { a, Author }