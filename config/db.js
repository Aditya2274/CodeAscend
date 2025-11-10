import mongoose from 'mongoose'
async function main() {
    await mongoose.connect(process.env.DB_CONNECT_STRING)
}
export default main