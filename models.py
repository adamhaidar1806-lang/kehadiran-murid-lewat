from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    passg

db = SQLAlchemy(model_class=Base)

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin' or 'guru'
    nama_guru = db.Column(db.String(100))
    bertugas_dari = db.Column(db.Date)
    bertugas_hingga = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Tingkatan(db.Model):
    __tablename__ = 'tingkatan'
    
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(20), nullable=False)  # 'Tingkatan 1' to 'Tingkatan 5'
    
    kelas = db.relationship('Kelas', backref='tingkatan', lazy=True, cascade='all, delete-orphan')

class Kelas(db.Model):
    __tablename__ = 'kelas'
    
    id = db.Column(db.Integer, primary_key=True)
    nama_kelas = db.Column(db.String(50), nullable=False)
    nama_guru_kelas = db.Column(db.String(100))
    tingkatan_id = db.Column(db.Integer, db.ForeignKey('tingkatan.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    murid = db.relationship('Murid', backref='kelas', lazy=True)

class Murid(db.Model):
    __tablename__ = 'murid'
    
    id = db.Column(db.Integer, primary_key=True)
    nama_penuh = db.Column(db.String(100), nullable=False)
    ic = db.Column(db.String(20), unique=True, nullable=False)
    jantina = db.Column(db.String(10), nullable=False)  # 'Lelaki' or 'Perempuan'
    no_ibu_bapa = db.Column(db.String(20))
    kelas_id = db.Column(db.Integer, db.ForeignKey('kelas.id'), nullable=False)
    is_bookmarked = db.Column(db.Boolean, default=False)
    is_deleted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    kehadiran_lewat = db.relationship('KehadiranLewat', backref='murid', lazy=True)

class CategoryAlasan(db.Model):
    __tablename__ = 'category_alasan'
    
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(50), nullable=False)  # 'Iklim/Cuaca', 'Masalah Keluarga', 'Masalah Transport', 'Lain-lain'
    keywords = db.Column(db.Text)  # comma-separated keywords for auto-categorization

class KehadiranLewat(db.Model):
    __tablename__ = 'kehadiran_lewat'
    
    id = db.Column(db.Integer, primary_key=True)
    murid_id = db.Column(db.Integer, db.ForeignKey('murid.id'), nullable=False)
    tarikh = db.Column(db.Date, nullable=False)
    masa_sampai = db.Column(db.Time, nullable=False)
    minit_lewat = db.Column(db.Integer)
    alasan = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('category_alasan.id'))
    nota = db.Column(db.Text)
    checked_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    category = db.relationship('CategoryAlasan', backref='kehadiran_lewat')
    guru = db.relationship('User', backref='checked_records')

class Denda(db.Model):
    __tablename__ = 'denda'
    
    id = db.Column(db.Integer, primary_key=True)
    murid_id = db.Column(db.Integer, db.ForeignKey('murid.id'), nullable=False)
    jenis_denda = db.Column(db.Text, nullable=False)
    tarikh = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'completed'
    nota = db.Column(db.Text)
    assigned_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    murid = db.relationship('Murid', backref='denda')
    guru = db.relationship('User', backref='assigned_denda')

class ActivityLog(db.Model):
    __tablename__ = 'activity_log'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    action = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='activity_logs')

class SuratAmaran(db.Model):
    __tablename__ = 'surat_amaran'
    
    id = db.Column(db.Integer, primary_key=True)
    murid_id = db.Column(db.Integer, db.ForeignKey('murid.id'), nullable=False)
    bulan = db.Column(db.Integer, nullable=False)
    tahun = db.Column(db.Integer, nullable=False)
    tarikh_print = db.Column(db.DateTime, default=datetime.utcnow)
    printed_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    murid = db.relationship('Murid', backref='surat_amaran')
    guru = db.relationship('User', backref='printed_surat')
