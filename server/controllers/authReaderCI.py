import pytesseract
from PIL import Image
import re
import datetime

# Pour faire focntionner le code, il faut: 
#       donner le chemin de l'image (la photo de la carte d'identité bien cadrée)
#       Mettre 'o' si la carte d'identité est de nouvelle génération et 'n' si elle est de l'ancienne génération
#       Le code retourne la date de naissance et l'âge de la personne (dans le terminal)

#%% Choix type de CI

# Demander à l'utilisateur de saisir le chemin de l'image
chemin_image = input("Veuillez saisir le chemin de l'image : ")

# Connaître le tyoe de CI
type_ci = input("Votre Carte d'Identité est-elle de nouvelle génération? [o/n] : ")

#%% CI ancienne génération

def old_CI(chemin_image):

    # Charger l'image à partir du chemin spécifié
    image = Image.open(chemin_image)
    
    # Obtenir la taille de l'image (largeur x hauteur)
    largeur, hauteur = image.size
    
    # Définissez les coordonnées de la zone à lire
    x = largeur - largeur*0.35
    x_fin = largeur - largeur*0.1
    y = 0.4*hauteur 
    pas_h = 0.08*hauteur
    # Sélectionnez la zone à lire
    zone = (x, y , x_fin, y + pas_h)
    
    # Extraire la zone sélectionnée
    zone_selectionnee = image.crop(zone)
    
    # Afficher l'image
    image.show()
    
    # Afficher la zone sélectionnée
    zone_selectionnee.show()
    
    # Utilisez Tesseract pour faire de l'OCR sur la zone sélectionnée de l'image et obtenir le texte
    texte = pytesseract.image_to_string(zone_selectionnee)

    # Définir une expression régulière pour extraire les chiffres
    regex_chiffres = re.compile(r'\d+')
    
    # Trouver tous les chiffres dans le texte et les concaténer en une seule chaîne
    chiffres = ''.join(regex_chiffres.findall(texte))
    
    # Convertir chaque élément de la liste en entier
    chiffres_entiers = [int(chiffre) for chiffre in chiffres]
            
    return(chiffres_entiers)

#%% CI nouvelle génération

def new_CI(chemin_image):

    # Charger l'image à partir du chemin spécifié
    image = Image.open(chemin_image)
    
    # Obtenir la taille de l'image (largeur x hauteur)
    largeur, hauteur = image.size
    
    # Définissez les coordonnées de la zone à lire
    x = largeur - largeur*0.3
    x_fin = largeur - largeur*0.08
    y = hauteur/2 
    pas_h = hauteur/14
    # Sélectionnez la zone à lire
    zone = (x, y - pas_h, x_fin, y + pas_h)
    
    # Extraire la zone sélectionnée
    zone_selectionnee = image.crop(zone)
    
    # Afficher l'image
    image.show()
    
    # Afficher la zone sélectionnée
    zone_selectionnee.show()
    
    # Utilisez Tesseract pour faire de l'OCR sur la zone sélectionnée de l'image et obtenir le texte
    texte = pytesseract.image_to_string(zone_selectionnee)
        
    # Définir une expression régulière pour extraire les chiffres
    regex_chiffres = re.compile(r'\d+')
    
    # Trouver tous les chiffres dans le texte et les concaténer en une seule chaîne
    chiffres = ''.join(regex_chiffres.findall(texte))
    
    # Convertir chaque élément de la liste en entier
    chiffres_entiers = [int(chiffre) for chiffre in chiffres]
    
    return(chiffres_entiers)

#%% Formatage date naissance

def extraire_date_naissance(chiffres_entiers):
    # Extraire les chiffres pour le jour, le mois et l'année
   jour = chiffres_entiers[0:2]
   mois = chiffres_entiers[2:4]
   annee = chiffres_entiers[4:]
   
   # Convertir les chiffres en chaînes de caractères
   jour_str = ''.join(map(str, jour))
   mois_str = ''.join(map(str, mois))
   annee_str = ''.join(map(str, annee))
   
   # Concaténer les parties pour former la date au format "dd/mm/yyyy"
   date_naiss = f"{jour_str}/{mois_str}/{annee_str}"
   
   return date_naiss



#%% Fonction calcul de l'âge

def calculer_age(date_naissance_str):
    # Convertir la chaîne de date de naissance en objet datetime
    date_naissance = datetime.datetime.strptime(date_naissance_str, "%d/%m/%Y").date()
    
    # Obtenir la date du jour
    date_du_jour = datetime.date.today()
    
    # Calculer l'âge
    age = date_du_jour.year - date_naissance.year - ((date_du_jour.month, date_du_jour.day) < (date_naissance.month, date_naissance.day))
    
    return age

#%% Calcul

# Choix
if type_ci.lower() == 'o':
    date_naiss = new_CI(chemin_image)
else:
    date_naiss = old_CI(chemin_image)

#print(date_naiss)

date_n = extraire_date_naissance(date_naiss)

print("La date de naissance de la personne est le : ", date_n)

age_personne = calculer_age(date_n)

print("L'âge de la personne est :", age_personne)