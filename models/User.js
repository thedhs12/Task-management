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

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, lowercase: true, required: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: String, default: getFormattedDate } 


});

export default mongoose.model('User', userSchema);
