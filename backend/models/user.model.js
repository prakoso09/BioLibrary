import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    usn: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    gmail: {
        type: String,
        required: true,
        trim: true,
        match: /.+\@gmail\.com$/  // memastikan format gmail
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Dosen', 'Mahasiswa', 'Lembaga']
    },
    institusi: {
        type: String,
        required: function () { return this.role === 'Dosen' || this.role === 'Mahasiswa'; },
        trim: true,
    },
    nidn: {
        type: String,
        required: function () { return this.role === 'Dosen'; },
        trim: true
    },
    nim: {
        type: String,
        required: function () { return this.role === 'Mahasiswa'; },
        trim: true
    },
    nooFpark: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TamanNasional',
        required: function () { return this.role === 'Lembaga'; }
    },
    parkName: {
        type: String,
        required: function () { return this.role === 'Lembaga'; },
        trim: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
