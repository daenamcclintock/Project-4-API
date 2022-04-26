const mongoose = require('mongoose')
const Property = require('./property')

const db = require('../../config/db')

const seedProperties = [
    { address: '30 Indian Creek Island Rd, Indian Creek, FL 33154', price: 25268100, bedrooms: 5, bathrooms: 6, squareFootage: 7171, image1: 'https://photos.zillowstatic.com/fp/c03004a022feacadc4b5171de2174b89-cc_ft_960.jpg', amenities: ['pool', 'water views', 'private tennis court'], owner:'6267440e92b87732e67e7a39'},
    { address: '36 Beverly Park Cir, Beverly Hills, CA 90210', price: 11372300, bedrooms: 4, bathrooms: 9, squareFootage: 8091, image1: 'https://ap.rdcpix.com/8837e1a4133c592f3536426bbfd8fa15l-w933172565s-w480_h480_q80.webp', amenities: ['pool', 'private tennis court', 'home gym'], owner:'6267440e92b87732e67e7a39'},
    { address: '21 Beverly Park Ter, Beverly Hills, CA 90210', price: 20405300, bedrooms: 7, bathrooms: 10, squareFootage: 13049, image1: 'https://ssl.cdn-redfin.com/photo/40/ismphoto/140/genIsm.21-703140_0.jpg', amenities: ['pool', 'home gym', 'water fountain', 'hot tub'], owner:'6267440e92b87732e67e7a39'},
    { address: '2975 Lazy Lane Blvd, Houston, TX 77019', price: 15999300, bedrooms: 7, bathrooms: 8, squareFootage: 10871, image1: 'https://prpmedia.harstatic.com/3103171/hr/img-1.jpeg', amentities: ['pool', 'private tennis court', 'hot tub'], owner:'6267440e92b87732e67e7a39'},
    { address: '113 Conyers Farm Dr, Greenwich, CT 06831', price: 5730300, bedrooms: 8, bathrooms: 9, squareFootage: 5610, image1: 'https://photos.zillowstatic.com/fp/1837b31dd4aa086e38ff3e427f855453-p_c.jpg', amenities: ['pool', 'private tennis court', 'home gym'], owner:'6267440e92b87732e67e7a39'},
    { address: '237 Strawberry Park Ct, Beaver Creek, CO 81620', price: 14197100, bedrooms: 7, bathrooms: 8, squareFootage: 8877, image1: 'https://public.bhhscoloradoproperties.com/BCR_PUBLIC/MLSPhotos/VMLRES/930573_1.jpg', amenities: ['pool', 'water views', 'NYC skyline view'], owner:'6267440e92b87732e67e7a39'},
    { address: '25 Field Point Cir, Greenwich, CT 06830', price: 12589000, bedrooms: 6, bathrooms: 8, squareFootage: 7999, image1: 'https://photos.zillowstatic.com/fp/6afec07e975f0b29000127992649d42a-cc_ft_384.jpg', amenities: ['pool', 'home gym', 'hot tub'], owner:'6267440e92b87732e67e7a39'},
    { address: '55 Coopers Neck Ln, Southampton, NY 11968', price: 48342700, bedrooms: 6, bathrooms: 6, squareFootage: 4191, image1: 'https://27eastmount.s3.amazonaws.com/2021/01/55coopers1.jpg', amenities: ['pool', 'water view', 'private dock', 'private tennis court', 'home gym'], owner:'6267440e92b87732e67e7a39'},
    { address: '617 Nimes Rd, Los Angeles, CA 90077', price: 21469200, bedrooms: 7, bathrooms: 8, squareFootage: 11055, image1: 'https://ssl.cdn-redfin.com/photo/40/ismphoto/318/genIsm.21-701318_2.jpg', amenities: ['pool', 'private tennis court', 'wine vineyard', 'golf course'], owner:'6267440e92b87732e67e7a39'},
    { address: '530 Arvida Pkwy, Coral Gables, FL 33156', price: 45000000, bedrooms: 8, bathrooms: 14, squareFootage: 13216, image1: 'https://ssl.cdn-redfin.com/photo/105/mbphoto/495/genMid.A11170495_1_0.jpg', amenities: ['pool', 'water view', 'private dock', 'tennis court'], owner:'6267440e92b87732e67e7a39'},
]

// Connect to the db via mongoose
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        Property.remove({})
            .then(deletedProperty => {
                console.log('deleted properties', deletedProperty)
                // using console logs to check if it's working or if there are errors
                Property.create(seedProperties)
                    // console.log('seedProperties', seedProperties)
                    .then(newProperties => {
                        // console.log('newProperties', newProperties)
                        mongoose.connection.close()
                    })
                    .catch(err => {
                        console.log(err)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log('this is the ERROR', error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log('this is the error', error)
        mongoose.connection.close()
    })