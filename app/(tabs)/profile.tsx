import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Globe, Moon, Lock, LogOut, ChevronRight, CreditCard as Edit } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfilePage() {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const userProfile = {
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@gmail.com',
    phone: '+91 9876543210',
    location: 'Maharashtra, India',
    memberSince: 'January 2024'
  };

  const languages = ['English', 'Hindi', 'Marathi'];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') }
      ]
    );
  };

  const ProfileHeader = () => (
    <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: `${colors.primary}15` }]}>
          <User size={40} color={colors.primary} />
        </View>
        <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
          <Edit size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <Text style={[styles.profileName, { color: colors.text }]}>{userProfile.name}</Text>
        <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{userProfile.email}</Text>
        <Text style={[styles.profileMember, { color: colors.textSecondary }]}>{userProfile.memberSince}</Text>
      </View>
    </View>
  );

  const SettingsItem = ({ icon: Icon, title, value, onPress, showChevron = true }) => (
    <TouchableOpacity style={[styles.settingsItem, { borderBottomColor: colors.border }]} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <View style={[styles.settingsIcon, { backgroundColor: `${colors.primary}15` }]}>
          <Icon size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>{title}</Text>
          {value && <Text style={[styles.settingsValue, { color: colors.textSecondary }]}>{value}</Text>}
        </View>
      </View>
      {showChevron && <ChevronRight size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  const LanguageSelector = () => (
    <View style={styles.languageSelector}>
      <Text style={[styles.languageSelectorTitle, { color: colors.text }]}>Language</Text>
      {languages.map((language) => (
        <TouchableOpacity
          key={language}
          style={[
            styles.languageOption,
            selectedLanguage === language && { backgroundColor: `${colors.primary}15` }
          ]}
          onPress={() => setSelectedLanguage(language)}
        >
          <Text style={[
            styles.languageOptionText,
            { color: selectedLanguage === language ? colors.primary : colors.textSecondary },
            selectedLanguage === language && { fontWeight: '600' }
          ]}>
            {language}
          </Text>
          {selectedLanguage === language && (
            <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile & Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileHeader />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Settings</Text>
          <View style={[styles.settingsGroup, { backgroundColor: colors.surface }]}>
            <SettingsItem
              icon={User}
              title="Edit Profile"
              value="Update your personal information"
              onPress={() => console.log('Edit profile')}
            />
            <SettingsItem
              icon={Mail}
              title="Email"
              value={userProfile.email}
              onPress={() => console.log('Change email')}
            />
            <SettingsItem
              icon={Lock}
              title="Change Password"
              value="Update your password"
              onPress={() => console.log('Change password')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
          <View style={[styles.settingsGroup, { backgroundColor: colors.surface }]}>
            <LanguageSelector />
            
            <View style={[styles.settingsItem, { borderBottomColor: colors.border }]}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.settingsIcon, { backgroundColor: `${colors.primary}15` }]}>
                  <Moon size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.settingsTitle, { color: colors.text }]}>Dark Mode</Text>
                  <Text style={[styles.settingsValue, { color: colors.textSecondary }]}>Enable dark theme</Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          <View style={[styles.settingsGroup, { backgroundColor: colors.surface }]}>
            <SettingsItem
              icon={Globe}
              title="Help Center"
              value="Get help and support"
              onPress={() => console.log('Help center')}
            />
            <SettingsItem
              icon={Mail}
              title="Contact Support"
              value="Get in touch with our team"
              onPress={() => console.log('Contact support')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surface }]} onPress={handleLogout}>
            <LogOut size={20} color={colors.error} />
            <Text style={[styles.logoutButtonText, { color: colors.error }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>CropCash v1.0.0</Text>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>© 2024 CropCash. All rights reserved.</Text>
        </View>
        
        {/* Bottom padding for safe area */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileHeader: {
    padding: 24,
    borderRadius: 12,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  profileMember: {
    fontSize: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingsGroup: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingsValue: {
    fontSize: 14,
  },
  languageSelector: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  languageSelectorTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  languageOptionText: {
    fontSize: 14,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  appInfoText: {
    fontSize: 12,
    marginBottom: 4,
  },
});