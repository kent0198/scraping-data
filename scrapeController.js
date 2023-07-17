const scrapers = require('./scraper')
const fs = require('fs')

const scrapeController = async (browserInstance) => {
    const url = 'https://digital-world-2.myshopify.com/'
    try {
        let browser = await browserInstance
        // gọi hàm tạo ở file s scrape
        const categories = await scrapers.scrapeCategory(browser, url)

         // Get a list of all the items in each category.
        const catePromise=[]
        for (let i of categories) catePromise.push(scrapers.scrapeItems(browser,i.link))

         // Get the data for each item.
        const itemAllCate=await Promise.all(catePromise)

         // Save the data to a JSON file.
        const prodPromise = []
        for(let i of itemAllCate) {
            for(let j of i) prodPromise.push(await scrapers.scraper(browser,j))
        }
        const rs=await Promise.all(prodPromise)
        
        fs.writeFile('ecommerce.json', JSON.stringify(rs), (err) => {
            if (err) console.log('Ghi data vô file json thất bại: ' + err)
                     console.log('Thêm data thanh công !.')
        })             
        await browser.close()
    } catch (e) {
        console.log('Lỗi ở scrape controller: ' + e);
    }
}

module.exports = scrapeController