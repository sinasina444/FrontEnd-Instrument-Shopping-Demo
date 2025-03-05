<template>
  <div class="container">
    <el-card class="card" shadow="hover">
      <h2 class="title">User Profile</h2>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else class="content">
        <div>
          <span>Username: </span>
          <span>{{ info.username }}</span>
        </div>
        <div>
          <span>Type: </span>
          <span>{{ info.role }}</span>
        </div>
        <div>
          <span>Email: </span>
          <span v-if="!editMode">{{ info.email }}</span>
          <el-input v-else v-model="tempInfo.email" size="small"></el-input>
        </div>
        <div>
          <span>Phone: </span>
          <span v-if="!editMode">{{ info.phoneNumber }}</span>
          <el-input v-else v-model="tempInfo.phoneNumber" size="small"></el-input>
        </div>
        <div>
          <span>Address: </span>
          <span v-if="!editMode">{{ info.address }}</span>
          <el-input v-else v-model="tempInfo.address" size="small"></el-input>
        </div>
      </div>
      <div class="actions">
        <div class="left-buttons">
          <el-button v-if="!editMode" type="primary" @click="editMode = true">Edit</el-button>
          <el-button v-if="editMode" type="success" @click="saveChanges">Save</el-button>
          <el-button v-if="editMode" type="danger" @click="cancelChanges">Cancel</el-button>
        </div>
        <div class="right-buttons">
          <el-button class="button" type="primary" @click="handleClick">Go back</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        username: "",
        role: "",
        email: "",
        address: "",
        phoneNumber: ""
      },
      tempInfo: {}, // Temporary object to hold editable fields
      loading: true,
      editMode: false, // Tracks whether we are in edit mode
    };
  },
  created() {
    this.fetchUserInfo();
  },
  methods: {
    async fetchUserInfo() {
      try {
        const response = await this.$axios.post('/UserProfile/getUserInfoByUsername', {
          username: localStorage.getItem('user')
        });
        const res = response.data;
        if (res.code === 200) {
          this.info = { ...res };
        } else {
          this.$message.error('Failed to fetch user information');
        }
      } catch (error) {
        console.error(error);
        this.$message.error('An error occurred while fetching user information');
      } finally {
        this.loading = false;
      }
    },
    editModeToggle() {
      this.tempInfo = { ...this.info }; // Copy current info to tempInfo for editing
      this.editMode = true;
    },
    async saveChanges() {
      try {
        const response = await this.$axios.post('/UserProfile/updateUserInfo', {
            username: this.info.username, // Ensure username is included in the payload
            email: this.tempInfo.email,
            phoneNumber: this.tempInfo.phoneNumber,
            address: this.tempInfo.address,
        });
        if (response.data.code === 200) {
          this.info = { 
                ...this.info, 
                email: this.tempInfo.email,
                phoneNumber: this.tempInfo.phoneNumber,
                address: this.tempInfo.address 
            };
          this.editMode = false;
          this.$message.success('Profile updated successfully');
        } else {
          this.$message.error('Failed to save changes');
        }
      } catch (error) {
        console.error(error);
        this.$message.error('An error occurred while saving changes');
      }
    },
    cancelChanges() {
      this.tempInfo = {}; // Clear tempInfo
      this.editMode = false; // Exit edit mode without saving
    },
    handleClick() {
      this.$router.back();
    }
  }
};
</script>



<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f2f2f2;
  padding: auto;
  box-sizing:border-box;
}

.card {
  width: 100%;
  max-width:700px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 28px;
  color: #409EFF;
}

.button {
  display: block;
  margin: 0 auto;
  padding: 10px 20px;
}

.left-buttons,
.right-buttons {
  display: flex;
  gap: 10px; /* Adds space between buttons in each group */
}

.content>div {
  margin-top: 20px;
  margin-bottom: 50px;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: space-between; /* Ensures space between groups */
  align-items: center;
  margin-top: 20px;
}
</style>