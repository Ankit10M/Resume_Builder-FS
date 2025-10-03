import mongoose  from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required:true
    },
    title:{
        type:String,
        required:true
    },
    thumbnailLink:{
        type:String,
    },
    template:{
        theme:String,
        colorPlatte:[String]
    },
    profileInfo:{
        profilePreviewUrl: String,
        fullName:String,
        designation:String,
        summary:String
    },
    contactInfo:{
        email:String,
        phone:String,
        location:String,
        linkedIn:String,
        githubLink:String,
        websiteLink:String
    },
    WorkExperience:[{
        company: String,
        role:String,
        startDate:String,
        endDate:String,
        description:String,
    }],
    education:[{
        degree:String,
        institution:String,
        startDate:String,
        endDate:String,
    }],
    skills:[{
        name:String,
        progress:Number
    }],
    projects:[{
        title:String,
        description:String,
        githubLink:String,
        livedemo:String
    }],
    Certification:[{
        title:String,
        issuer:String,
        year:String
    }],
    language:[{
        name: String,
        progress:Number
    }],
    interests:[String]
},
{timestamps:{createdAt:"createdAt",updatedAt:"updatedAt"}}
)
export default mongoose.model("Resume",resumeSchema)


