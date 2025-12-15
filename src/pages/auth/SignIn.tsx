import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'react-router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  lockClosedOutline,
  logInOutline,
  mailOutline,
  logoGoogle
} from 'ionicons/icons';
import { Link } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    user,
    signIn,
    signInWithGoogle,
    loading: authLoading
  } = useAuth();

  if (authLoading) {
    return null;
  }

  if (user) {
    return (
      <Redirect to="/tab1" />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Quest</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonCard className="ion-padding">
            <IonCardHeader>
              <IonCardSubtitle>Účet</IonCardSubtitle>
              <IonCardTitle>Přihlášení</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {error && (
                <IonText color="danger">
                  <p>{error}</p>
                </IonText>
              )}
              <IonItem lines="full" className="ion-margin-bottom">
                <IonInput
                  type="email"
                  label="E-mail"
                  labelPlacement="floating"
                  placeholder="user@example.com"
                  autocomplete="email"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? '')}
                >
                  <IonIcon icon={mailOutline} slot="start" />
                </IonInput>
              </IonItem>
              <IonItem lines="full" className="ion-margin-bottom">
                <IonInput
                  type="password"
                  label="Heslo"
                  labelPlacement="floating"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value ?? '')}
                >
                  <IonIcon icon={lockClosedOutline} slot="start" />
                  <IonInputPasswordToggle slot="end" />
                </IonInput>
              </IonItem>
              <IonButton
                expand="block"
                shape="round"
                type="submit"
                disabled={loading}
                className="ion-margin-bottom"
              >
                {loading ? (
                    <IonSpinner name="crescent" />
                ) : (
                  <>
                    <IonText>Přihlásit se</IonText>
                    <IonIcon icon={logInOutline} slot="end" />
                  </>
                )}
              </IonButton>
              <IonButton
                expand="block"
                shape="round"
                type="button"
                onClick={handleGoogleSignIn}
                color="danger"
                disabled={loading}
                className="ion-margin-bottom"
              >
                {loading ? (
                    <IonSpinner name="crescent" />
                ) : (
                  <>
                    <IonText>Přihlásit se účtem Google</IonText>
                    <IonIcon icon={logoGoogle} slot="end" />
                  </>
                )}
              </IonButton>
              <IonText color="medium">
                <IonText>Nemáš účet? <Link to="/signup">Zaregistruj se.</Link></IonText>
              </IonText>
            </IonCardContent>
          </IonCard>
        </form>
      </IonContent>
    </IonPage>
  );
}

export default SignIn;
