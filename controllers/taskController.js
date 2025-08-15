import Task from '../models/Task.js';
import mongoose from 'mongoose';


const allowedStatus = ['Pending', 'In Progress', 'Completed'];
const allowedPriority = ['Low', 'Medium', 'High'];


export const createTask=async(req,res,next)=>{
  try{
    const{title,description,dueDate,status,priority,category,tags}=req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required.' });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Description is required.' });
    }

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatus.join(', ')}` });
    }

    if (priority && !allowedPriority.includes(priority)) {
      return res.status(400).json({ message: `Invalid priority. Allowed: ${allowedPriority.join(', ')}` });
    }

  if (!dueDate) {
  return res.status(400).json({ message: 'Due date is required.' });
} else if (isNaN(Date.parse(dueDate))) {
  return res.status(400).json({ message: 'Invalid dueDate format. Use a valid date.' });
}


     const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate),
      status: status || 'Pending',
      priority: priority || 'Medium',
      category:category||'General',
      tags:Array.isArray(tags)?tags:[],
      userId: req.userId,
     });
      res.status(201).json(task);
    

  }catch(err){
    next(err);
  }
};

export const getTasks=async(req,res,next)=>{
  try{
    const {status,priority,category,tags}=req.query;
    const filter={userId:req.userId};

    if (status) {
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: `Invalid status filter. Allowed: ${allowedStatus.join(', ')}` });
      }
      filter.status = status;
    }


    if (priority) {
      if (!allowedPriority.includes(priority)) {
        return res.status(400).json({ message: `Invalid priority filter. Allowed: ${allowedPriority.join(', ')}` });
      }
      filter.priority = priority;
    }

    if (category) {
      filter.category = category;
    }
    if (tags) {
      filter.tags = tags; 
    }

    const tasks=await Task.find(filter).sort({createdAt: -1});
    res.json(tasks);

  }catch(err){
    next(err);
  }
};

export const updateTask=async(req,res,next)=>{
  try{
    const id=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({message:'Invalid Task id'});
    }

    const allowed=['title','description','dueDate','status','priority','category','tags'];

    const updates={};

    for(const key of allowed){
      if(key in req.body && req.body[key]!=='') updates[key]=req.body[key];
    }

    if ('title' in updates && updates.title.trim() === '') {
      return res.status(400).json({ message: 'Title cannot be empty.' });
    }

    const allowedStatus = ['Pending', 'In Progress', 'Completed'];
    if ('status' in updates && !allowedStatus.includes(updates.status)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatus.join(', ')}` });
    }

    
    const allowedPriority = ['Low', 'Medium', 'High'];
    if ('priority' in updates && !allowedPriority.includes(updates.priority)) {
      return res.status(400).json({ message: `Invalid priority. Allowed: ${allowedPriority.join(', ')}` });
    }

    
    if ('dueDate' in updates && updates.dueDate && isNaN(Date.parse(updates.dueDate))) {
      return res.status(400).json({ message: 'Invalid dueDate format. Use a valid date.' });
    }
    if ('dueDate' in updates && updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    if ('tags' in updates && !Array.isArray(updates.tags)) {
      return res.status(400).json({ message: 'Tags must be an array.' });
    }
    
     const task=await Task.findOneAndUpdate({_id:id,userId:req.userId},updates,{new:true});
     if(!task) return res.status(404).json({message:'Task not found'});

     res.json(task);
    
  }catch(err){
    next(err);
  }
}

export const deleteTask = async (req, res, next) => {
  try {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
  message: 'Invalid task id' });
  const result = await Task.findOneAndDelete({ _id: id, userId:
  req.userId });
  if (!result) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted Successfully' });
  } catch (err) {
  next(err);
  }
  };