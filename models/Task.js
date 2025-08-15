import mongoose from 'mongoose';


function getFormattedDate() {
  const now = new Date();
  return now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  dueDate: { type: Date },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed']},
  priority: { type: String, enum: ['Low', 'Medium', 'High']},
  category: {type: String,default: "General",trim: true,},
  tags: {type: [String], default: [],},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: String, default: getFormattedDate }, 
  updatedAt: { type: String, default: getFormattedDate }
});


taskSchema.pre('save', function(next) {
  this.updatedAt = getFormattedDate();
  next();
});

taskSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = getFormattedDate();
  next();
});

export default mongoose.model('Task', taskSchema);
