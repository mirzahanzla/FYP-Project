import express from 'express';
import {
  createGroup,
  addGroupMember,
  getGroupMessages,
  sendGroupMessage,
  getGroupMessagesByGroupId,
  getGroups,
  modifyGroup,
  deleteGroup
} from '../controllers/groupController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Route for modifying a group
router.put('/group/modify/:groupId', upload.single('photo'), modifyGroup); 

// Route for deleting a group
router.delete('/group/delete/:groupId', deleteGroup);
router.get('/:groupId/messages', getGroupMessagesByGroupId);


router.post('/create', upload.single('photo'), createGroup); 
router.post('/addMember', addGroupMember); 
router.get('/:groupId/messages', getGroupMessages); 
router.post('/:groupId/sendMessage', sendGroupMessage); 
router.get('/:admin', getGroups); 

export default router;
