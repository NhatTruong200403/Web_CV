const { default: axios } = require('axios');
var companyModel = require('../schemas/company')
module.exports = {
    GetAllCompany: async function(){
        return await companyModel.find({
            isDeleted:false
          })
    },
    CreateCompany: async function (company,taxCode,body, imageUrl, userId) {
        try {
            let newJob = new companyModel({
                userId: userId,
                companyName: company.name,
                internationalName: company.internationalName,
                shortName: company.shortName,
                taxCode: taxCode,
                address: company.address,
                websiteUrl: body.websiteUrl,
                description: body.description,
                imageUrl: imageUrl
            })
          return await newJob.save();
        } catch (error) {
          throw new Error(error.message);
        }
      },
      CheckCompanyTaxCode: async function(taxCode, body, imageUrl, userId){
        const company = await axios.get(`https://api.vietqr.io/v2/business/${taxCode}`);
        var data = company.data;
        if(data.code == '00'){
            console.log(data);
            let newJob = this.CreateCompany(data.data, taxCode, body, imageUrl, userId);
        }
        // return await companyModel.findOne({taxCode:taxCode})
      }
}