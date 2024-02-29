
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const CardData = require('../models/CardData');
const jwt = require('jsonwebtoken');
const moment = require('moment');



router.get("/getname", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; 
    const decode = await jwt.verify(token, process.env.JWT_TOKEN);

    if (decode.userId) {
      const savedData = await User.findById(decode.userId);
      
      if (savedData) {
        const name = savedData.name;
        return res.status(200).json({
          name: name
        });
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

router.post("/save",async (req, res)=>{

  try {

    const {email, title, priority, tasks, date, group, logdate} = req.body
    console.log(email,title,priority,[tasks],date)
    if(!email || !title || !priority || !tasks || !group || !logdate){
      return res.status(401).json({message:"Bad request"})
    }

    const saveData = new CardData({
      email:email,
      title:title,
      priority:priority,
      tasks:tasks,
      date:date,
      group:group,
      logdate:logdate
    })

    const userResponse = await saveData.save()

    return res.status(200).json({message:"saved succesfully"})

  } catch (error) {
    console.log(error)
  }

})

router.get('/getallcards', async (req, res) => {
  try {
    const { email } = req.query;

    
    const data = await CardData.find({ email: email });

    
    return res.status(200).json({ data });
  } catch (error) {
   
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
 

router.get('/getcards', async (req, res) => {
  try {
    const { email, filterBy } = req.query;
    let filterCondition = {};

    
    if (filterBy === 'week') {
    
      filterCondition.logdate = { $gte: moment().startOf('week'), $lte: moment().endOf('week') };
    } else if (filterBy === 'month') {
     
      filterCondition.logdate = { $gte: moment().startOf('month'), $lte: moment().endOf('month') };
    } else if (filterBy === 'today') {
    
      filterCondition.logdate = {
        $gte: moment().startOf('day'),
        $lte: moment().endOf('day')
      };
    }

   
    const data = await CardData.find({ email: email, ...filterCondition });

   
    return res.status(200).json({ data });
  } catch (error) {
   
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.put('/updatecards', async (req,res)=>{
  try {

    const {title, priority, tasks, date, _id} = req.body

    const savedData = await CardData.findById(_id)
  
    if(savedData){
  
      savedData.title = title
      savedData.priority = priority
      savedData.tasks = tasks
      savedData.date = date
  
      await savedData.save()
  
      return res.status(200).json(savedData)
  
      console.log(savedData)
    }
    
  } catch (error) {
    console.log(error);
    
  }

})

router.put('/updategroup', async (req, res)=>{
  try {

    const {cardid, group} = req.body

  if(!cardid || !group){
    return res.status(500).json({message : "Bad request"})
  }

  const savedData  = await CardData.findById(cardid)

  if(savedData){
    savedData.group = group
    await savedData.save()

    return res.status(200).json({message : "group updated "})
  }
  else res.status(500).json({message: "somethhing went wrong"})
    
  } catch (error) {
    console.log(error);
    
  }
  
})


router.put('/checkboxupdate', async (req, res) => {
  try {
    console.log('Request Data:', req.body);
    
    const { taskId, status } = req.body;
    console.log('Task ID:', taskId);
    console.log('Status:', status);

 
    const existingTask = await CardData.findOne({ 'tasks._id': taskId, 'tasks.completed': true });
    console.log('Existing Task:', existingTask);

    const updatedTodo = await CardData.findOneAndUpdate(
      { 'tasks._id': taskId },
      { $set: { 'tasks.$.completed': status } },
      { new: true }
    );

    console.log('Updated Todo:', updatedTodo);

    if (updatedTodo) {
      return res.status(200).json({ updatedTodo });
    } else {
      return res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/deletecard', async(req, res)=>{
  try {
    const {cardId} = req.body
    console.log(cardId)
    if(!cardId){
      return res.status(500).json({message : "Bad Request"})
    }

    const deletedCard = await CardData.findByIdAndDelete(cardId);

    if (deletedCard) {
      return res.status(200).json({ message: 'Card deleted successfully', deletedCard });
    } else {
      return res.status(404).json({ message: 'Card not found' });
    }

    
  } catch (error) {
    console.log(error)
  }

})









module.exports = router;
