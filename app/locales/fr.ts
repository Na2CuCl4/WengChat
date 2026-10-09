import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";

const fr: PartialLocaleType = {
  WIP: "Prochainement...",
  Error: {
    Unauthorized: `😆 La conversation a rencontré quelques problèmes, pas de panique : Si vous utilisez une version déployée privée, cliquez [ici](/#/auth) pour entrer la clé d'accès 🔑`,
  },
  Auth: {
    Title: "Mot de passe requis",
    Tips: "L'administrateur a activé la vérification par mot de passe. Veuillez entrer le code d'accès ci-dessous",
    SubTips: "Ou entrez votre clé API OpenAI ou Google",
    Input: "Entrez le code d'accès ici",
    Confirm: "Confirmer",
    Later: "Plus tard",
    Return: "Retour",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} conversations`,
  },
  Chat: {
    SubTitle: (count: number) => `Total de ${count} conversations`,
    EditMessage: {
      Title: "Modifier l'historique des messages",
      Topic: {
        Title: "Sujet de la discussion",
        SubTitle: "Modifier le sujet de la discussion actuel",
      },
    },
    Actions: {
      ChatList: "Voir la liste des messages",
      CompressedHistory: "Voir l'historique des prompts compressés",
      Export: "Exporter l'historique de la discussion",
      Copy: "Copier",
      Stop: "Arrêter",
      Retry: "Réessayer",
      Pin: "Épingler",
      PinToastContent: "1 conversation épinglée aux prompts prédéfinis",
      PinToastAction: "Voir",
      Delete: "Supprimer",
      Edit: "Modifier",
      RefreshTitle: "Actualiser le titre",
      RefreshToast: "Demande d'actualisation du titre envoyée",
    },
    Commands: {
      new: "Nouvelle discussion",
      newm: "Créer une discussion à partir du masque",
      next: "Discussion suivante",
      prev: "Discussion précédente",
      clear: "Effacer le contexte",
      del: "Supprimer la discussion",
    },
    InputActions: {
      Stop: "Arrêter la réponse",
      ToBottom: "Aller au plus récent",
      Theme: {
        auto: "Thème automatique",
        light: "Mode clair",
        dark: "Mode sombre",
      },
      Prompt: "Commandes rapides",
      Masks: "Tous les masques",
      Clear: "Effacer la discussion",
      Settings: "Paramètres de la discussion",
      UploadImage: "Télécharger une image",
      UploadFile: "Télécharger un fichier",
      Model: "Modèle",
      Size: "Taille",
      Quality: "Qualité",
      Style: "Style",
      ReasoningEffort: "Raisonnement",
      Verbosity: "Verbosité",
      ResponseFormat: "Format",
    },
    Parsed: "Analysé",
    Rename: "Renommer la discussion",
    Typing: "En train d'écrire…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} pour envoyer`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += "，Shift + Enter pour passer à la ligne";
      }
      return inputHints + "，/ pour compléter, : pour déclencher des commandes";
    },
    Send: "Envoyer",
    Config: {
      Reset: "Effacer la mémoire",
      SaveAs: "Enregistrer comme masque",
    },
    IsContext: "Prompt prédéfini",
  },
  Export: {
    Title: "Partager l'historique des discussions",
    Copy: "Tout copier",
    Download: "Télécharger le fichier",
    Share: "Partager sur ShareGPT",
    MessageFromYou: "Utilisateur",
    MessageFromChatGPT: "Assistant IA",
    Format: {
      Title: "Format d'exportation",
      SubTitle: "Vous pouvez exporter en texte Markdown ou en image PNG",
    },
    IncludeContext: {
      Title: "Inclure le contexte du masque",
      SubTitle: "Afficher le contexte du masque dans les messages",
    },
    Steps: {
      Select: "Sélectionner",
      Preview: "Aperçu",
    },
    Image: {
      Toast: "Génération de la capture d'écran",
      Modal:
        "Appuyez longuement ou faites un clic droit pour enregistrer l'image",
    },
  },
  Select: {
    Search: "Rechercher des messages",
    All: "Tout sélectionner",
    Latest: "Derniers messages",
    Clear: "Effacer la sélection",
  },
  Memory: {
    Title: "Résumé historique",
    EmptyContent: "Le contenu de la discussion est trop court pour être résumé",
    Send: "Compresser automatiquement l'historique des discussions et l'envoyer comme contexte",
    Copy: "Copier le résumé",
    Reset: "[unused]",
    ResetConfirm: "Confirmer la suppression du résumé historique ?",
  },
  Home: {
    NewChat: "Nouvelle discussion",
    DeleteChat: "Confirmer la suppression de la discussion sélectionnée ?",
    DeleteToast: "Discussion supprimée",
    Revert: "Annuler",
  },
  Settings: {
    Title: "Paramètres",
    SubTitle: "Toutes les options de configuration",

    Danger: {
      Reset: {
        Title: "Réinitialiser tous les paramètres",
        SubTitle:
          "Réinitialiser toutes les options de configuration aux valeurs par défaut",
        Action: "Réinitialiser maintenant",
        Confirm: "Confirmer la réinitialisation de tous les paramètres ?",
      },
      Clear: {
        Title: "Effacer toutes les données",
        SubTitle:
          "Effacer toutes les discussions et les données de configuration",
        Action: "Effacer maintenant",
        Confirm:
          "Confirmer l'effacement de toutes les discussions et données de configuration ?",
      },
    },
    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "Toutes les langues",
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Taille de la police",
      SubTitle: "Taille de la police pour le contenu des discussions",
    },
    FontFamily: {
      Title: "Police de Chat",
      SubTitle:
        "Police du contenu du chat, laissez vide pour appliquer la police par défaut globale",
      Placeholder: "Nom de la Police",
    },
    InjectSystemPrompts: {
      Title: "Injecter des invites système",
      SubTitle:
        "Ajouter de manière forcée une invite système simulée d'assistant IA au début de chaque liste de messages",
    },
    InputTemplate: {
      Title: "Prétraitement des entrées utilisateur",
      SubTitle:
        "Le dernier message de l'utilisateur sera intégré dans ce modèle",
    },

    Update: {
      Version: (x: string) => `Version actuelle : ${x}`,
      IsLatest: "Vous avez la dernière version",
      CheckUpdate: "Vérifier les mises à jour",
      IsChecking: "Vérification des mises à jour en cours...",
      FoundUpdate: (x: string) => `Nouvelle version trouvée : ${x}`,
      GoToUpdate: "Aller à la mise à jour",
    },
    SendKey: "Touche d'envoi",
    Theme: "Thème",
    TightBorder: "Mode sans bordure",
    SendPreviewBubble: {
      Title: "Bulle d'aperçu",
      SubTitle: "Aperçu du contenu Markdown dans la bulle d'aperçu",
    },
    AutoGenerateTitle: {
      Title: "Génération automatique de titres",
      SubTitle:
        "Générer un titre approprié en fonction du contenu de la discussion",
    },
    Sync: {
      CloudState: "Données cloud",
      NotSyncYet: "Pas encore synchronisé",
      Syncing: "Synchronisation en cours, veuillez ne pas fermer la page",
      Success: "Synchronisation réussie",
      Fail: "Échec de la synchronisation",

      Config: {
        Modal: {
          Title: "Configurer la synchronisation cloud",
          Check: "Vérifier la disponibilité",
        },
        SyncType: {
          Title: "Type de synchronisation",
          SubTitle: "Choisissez le serveur de synchronisation préféré",
        },
        Proxy: {
          Title: "Activer le proxy",
          SubTitle:
            "Lors de la synchronisation dans le navigateur, le proxy doit être activé pour éviter les restrictions de domaine croisé",
        },
        ProxyUrl: {
          Title: "Adresse du proxy",
          SubTitle:
            "Uniquement pour le proxy de domaine croisé fourni par le projet",
        },

        WebDav: {
          Endpoint: "Adresse WebDAV",
          UserName: "Nom d'utilisateur",
          Password: "Mot de passe",
        },

        UpStash: {
          Endpoint: "URL REST Redis UpStash",
          UserName: "Nom de sauvegarde",
          Password: "Token REST Redis UpStash",
        },
      },

      LocalState: "Données locales",
      Overview: (overview: any) => {
        return `${overview.chat} discussions, ${overview.message} messages, ${overview.prompt} invites, ${overview.mask} masques`;
      },
      ImportFailed: "Échec de l'importation",

      Interval: {
        Title: "Intervalle de synchronisation automatique",
        Selection: {
          Hourly: "Horaire",
          Daily: "Quotidien",
          Weekly: "Hebdomadaire",
          Monthly: "Mensuel",
          Never: "Jamais",
        },
      },
    },
    Mask: {
      Splash: {
        Title: "Page de démarrage du masque",
        SubTitle:
          "Afficher la page de démarrage du masque lors de la création d'une nouvelle discussion",
      },
      Builtin: {
        Title: "Masquer les masques intégrés",
        SubTitle:
          "Masquer les masques intégrés dans toutes les listes de masques",
      },
    },
    Prompt: {
      Disable: {
        Title: "Désactiver la complétion automatique des invites",
        SubTitle:
          "Saisir / au début de la zone de texte pour déclencher la complétion automatique",
      },
      List: "Liste des invites personnalisées",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} intégrées, ${custom} définies par l'utilisateur`,
      Edit: "Modifier",
      Modal: {
        Title: "Liste des invites",
        Add: "Créer",
        Search: "Rechercher des invites",
      },
      EditModal: {
        Title: "Modifier les invites",
      },
    },
    HistoryCount: {
      Title: "Nombre de messages historiques",
      SubTitle: "Nombre de messages historiques envoyés avec chaque demande",
    },
    CompressThreshold: {
      Title: "Seuil de compression des messages historiques",
      SubTitle:
        "Compresser les messages historiques lorsque leur longueur dépasse cette valeur",
    },

    Usage: {
      Title: "Vérification du solde",
      SubTitle(used: any, total: any) {
        return `Utilisé ce mois-ci : $${used}, Total d'abonnement : $${total}`;
      },
      IsChecking: "Vérification en cours…",
      Check: "Re-vérifier",
      NoAccess:
        "Entrez la clé API ou le mot de passe d'accès pour vérifier le solde",
    },

    Access: {
      AccessCode: {
        Title: "Mot de passe d'accès",
        SubTitle: "L'administrateur a activé l'accès sécurisé",
        Placeholder: "Veuillez entrer le mot de passe d'accès",
      },
      CustomEndpoint: {
        Title: "Interface personnalisée",
        SubTitle: "Utiliser un service Azure ou OpenAI personnalisé",
      },
      Provider: {
        Title: "Fournisseur de modèle",
        SubTitle: "Changer de fournisseur de service",
      },
      OpenAI: {
        ApiKey: {
          Title: "Clé API",
          SubTitle:
            "Utiliser une clé OpenAI personnalisée pour contourner les restrictions d'accès par mot de passe",
          Placeholder: "Clé API OpenAI",
        },

        Endpoint: {
          Title: "Adresse de l'interface",
          SubTitle: "Doit inclure http(s):// en dehors de l'adresse par défaut",
        },
      },
      Azure: {
        ApiKey: {
          Title: "Clé d'interface",
          SubTitle:
            "Utiliser une clé Azure personnalisée pour contourner les restrictions d'accès par mot de passe",
          Placeholder: "Clé API Azure",
        },

        Endpoint: {
          Title: "Adresse de l'interface",
          SubTitle: "Exemple :",
        },

        ApiVerion: {
          Title: "Version de l'interface (version API azure)",
          SubTitle: "Choisissez une version spécifique",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "Clé d'interface",
          SubTitle:
            "Utiliser une clé Anthropic personnalisée pour contourner les restrictions d'accès par mot de passe",
          Placeholder: "Clé API Anthropic",
        },

        Endpoint: {
          Title: "Adresse de l'interface",
          SubTitle: "Exemple :",
        },

        ApiVerion: {
          Title: "Version de l'interface (version API claude)",
          SubTitle: "Choisissez une version spécifique de l'API",
        },
      },
      Google: {
        ApiKey: {
          Title: "Clé API",
          SubTitle: "Obtenez votre clé API Google AI",
          Placeholder: "Entrez votre clé API Google AI Studio",
        },

        Endpoint: {
          Title: "Adresse de l'interface",
          SubTitle: "Exemple :",
        },

        ApiVersion: {
          Title: "Version de l'API (pour gemini-pro uniquement)",
          SubTitle: "Choisissez une version spécifique de l'API",
        },
        GoogleSafetySettings: {
          Title: "Niveau de filtrage de sécurité Google",
          SubTitle: "Définir le niveau de filtrage du contenu",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "Clé API",
          SubTitle: "Utiliser une clé API Baidu personnalisée",
          Placeholder: "Clé API Baidu",
        },
        SecretKey: {
          Title: "Clé secrète",
          SubTitle: "Utiliser une clé secrète Baidu personnalisée",
          Placeholder: "Clé secrète Baidu",
        },
        Endpoint: {
          Title: "Adresse de l'interface",
          SubTitle:
            "Non pris en charge pour les configurations personnalisées dans .env",
        },
      },
      ByteDance: {
        ApiKey: {
          Title: "Clé d'interface",
          SubTitle: "Utiliser une clé API ByteDance personnalisée",
          Placeholder: "Clé API ByteDance",
        },
        Endpoint: {
          Title: "Adresse de l'interface",
          SubTitle: "Exemple :",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "Clé d'interface",
          SubTitle: "Utiliser une clé API Alibaba Cloud personnalisée",
          Placeholder: "Clé API Alibaba Cloud",
        },
        Endpoint: {
          Title: "Adresse de l'interface",
          SubTitle: "Exemple :",
        },
      },
      AI302: {
        ApiKey: {
          Title: "Clé d'interface",
          SubTitle: "Utiliser une clé API 302.AI personnalisée",
          Placeholder: "Clé API 302.AI",
        },
        Endpoint: {
          Title: "Adresse de l'endpoint",
          SubTitle: "Exemple :",
        },
      },
      CustomModel: {
        Title: "Nom du modèle personnalisé",
        SubTitle:
          "Ajouter des options de modèles personnalisés, séparées par des virgules",
      },
    },

    Model: "Modèle",
    CompressModel: {
      Title: "Modèle de compression",
      SubTitle: "Modèle utilisé pour compresser l'historique",
    },
    Temperature: {
      Title: "Aléatoire (temperature)",
      SubTitle: "Plus la valeur est élevée, plus les réponses sont aléatoires",
    },
    TopP: {
      Title: "Échantillonnage par noyau (top_p)",
      SubTitle:
        "Semblable à l'aléatoire, mais ne pas modifier en même temps que l'aléatoire",
    },
    MaxTokens: {
      Title: "Limite de réponse unique (max_tokens)",
      SubTitle: "Nombre maximal de tokens utilisés pour une interaction unique",
    },
    PresencePenalty: {
      Title: "Nouveauté du sujet (presence_penalty)",
      SubTitle:
        "Plus la valeur est élevée, plus il est probable d'élargir aux nouveaux sujets",
    },
    FrequencyPenalty: {
      Title: "Pénalité de fréquence (frequency_penalty)",
      SubTitle:
        "Plus la valeur est élevée, plus il est probable de réduire les répétitions",
    },
  },
  Store: {
    DefaultTopic: "Nouvelle discussion",
    BotHello: "Comment puis-je vous aider ?",
    Error: "Une erreur est survenue, veuillez réessayer plus tard",
    Prompt: {
      History: (content: string) =>
        "Voici le résumé de la discussion précédente : " + content,
      Topic:
        "Utilisez quatre à cinq mots pour retourner le sujet succinct de cette phrase, sans explication, sans ponctuation, sans interjections, sans texte superflu, sans gras. Si aucun sujet, retournez simplement « discussion informelle »",
      Summarize:
        "Faites un résumé succinct de la discussion, à utiliser comme prompt de contexte ultérieur, en moins de 200 mots",
    },
  },
  Copy: {
    Success: "Copié dans le presse-papiers",
    Failed: "Échec de la copie, veuillez autoriser l'accès au presse-papiers",
  },
  Download: {
    Success: "Le contenu a été téléchargé dans votre répertoire.",
    Failed: "Échec du téléchargement.",
  },
  Context: {
    Toast: (x: any) => `Contient ${x} invites prédéfinies`,
    Edit: "Paramètres de la discussion actuelle",
    Add: "Ajouter une discussion",
    Clear: "Contexte effacé",
    Revert: "Restaurer le contexte",
  },
  Plugin: {
    Name: "Plugin",
  },
  FineTuned: {
    Sysmessage: "Vous êtes un assistant",
  },
  SearchChat: {
    Name: "Recherche",
    Page: {
      Title: "Rechercher dans l'historique des discussions",
      Search: "Entrez le mot-clé de recherche",
      NoResult: "Aucun résultat trouvé",
      NoData: "Aucune donnée",
      Loading: "Chargement",

      SubTitle: (count: number) => `${count} résultats trouvés`,
    },
    Item: {
      View: "Voir",
    },
  },
  Mask: {
    Name: "Masque",
    Page: {
      Title: "Masques de rôle prédéfinis",
      SubTitle: (count: number) => `${count} définitions de rôle prédéfinies`,
      Search: "Rechercher des masques de rôle",
      Create: "Créer",
    },
    Item: {
      Info: (count: number) => `Contient ${count} discussions prédéfinies`,
      Chat: "Discussion",
      View: "Voir",
      Edit: "Modifier",
      Delete: "Supprimer",
      DeleteConfirm: "Confirmer la suppression ?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Modifier le masque prédéfini ${readonly ? " (lecture seule)" : ""}`,
      Download: "Télécharger le masque",
      Clone: "Cloner le masque",
    },
    Config: {
      Avatar: "Avatar du rôle",
      Name: "Nom du rôle",
      Sync: {
        Title: "Utiliser les paramètres globaux",
        SubTitle:
          "Cette discussion utilise-t-elle les paramètres du modèle globaux ?",
        Confirm:
          "Les paramètres personnalisés de cette discussion seront automatiquement remplacés. Confirmer l'activation des paramètres globaux ?",
      },
      HideContext: {
        Title: "Masquer les discussions prédéfinies",
        SubTitle:
          "Les discussions prédéfinies ne seront pas affichées dans l'interface de discussion après masquage",
      },
      Share: {
        Title: "Partager ce masque",
        SubTitle: "Générer un lien direct pour ce masque",
        Action: "Copier le lien",
      },
    },
  },
  NewChat: {
    Return: "Retour",
    Skip: "Commencer directement",
    NotShow: "Ne plus afficher",
    ConfirmNoShow:
      "Confirmer la désactivation ? Vous pourrez réactiver cette option à tout moment dans les paramètres.",
    Title: "Choisir un masque",
    SubTitle: "Commencez maintenant, rencontrez les pensées derrière le masque",
    More: "Voir tout",
  },

  URLCommand: {
    Code: "Code d'accès détecté dans le lien, souhaitez-vous le remplir automatiquement ?",
    Settings:
      "Paramètres prédéfinis détectés dans le lien, souhaitez-vous les remplir automatiquement ?",
  },

  UI: {
    Confirm: "Confirmer",
    Cancel: "Annuler",
    Close: "Fermer",
    Create: "Créer",
    Edit: "Modifier",
    Export: "Exporter",
    Import: "Importer",
    Sync: "Synchroniser",
    Config: "Configurer",
  },
  Exporter: {
    Description: {
      Title:
        "Seuls les messages après avoir effacé le contexte seront affichés",
    },
    Model: "Modèle",
    Messages: "Messages",
    Topic: "Sujet",
    Time: "Temps",
  },
  FileConversion: {
    Title: "Conversion de fichiers",
    SubTitle:
      "Convertissez des fichiers binaires (ex. DOCX / PPTX / XLSX / PDF) en fichiers texte (ex. Markdown) pour la reconnaissance et la compréhension par l'IA.",
    Settings: "Paramètres",
    Conversion: "Conversion",
    Engine: {
      Title: "Moteur de conversion de fichiers",
      MarkItDown: "MarkItDown",
      MarkItDownDesc: "Convertir des documents avec MarkItDown.",
      MinerU: "MinerU",
      MinerUDesc:
        "Convertir des documents avec MinerU, un moteur d'analyse de documents haute précision conçu pour les scénarios LLM · RAG · Agent.",
    },
    HealthCheck: {
      Title: "Vérifier la disponibilité",
      Action: "Vérifier",
      Checking: "Vérification…",
      Unavailable: "Service indisponible",
      Version: "Version",
      Queueing: "En file d'attente",
      Processing: "En cours",
      Completed: "Terminé",
      Failed: "Échec",
    },
    MarkItDown: {
      EnableDocIntelligence: {
        Title: "Utiliser Document Intelligence",
        Desc: "Conversion de documents basée sur l'IA, améliore la qualité des documents complexes, augmente considérablement le temps de conversion.",
      },
    },
    MinerU: {
      ParseBackend: {
        Title: "Backend d'analyse",
        Pipeline: "pipeline",
        PipelineDesc:
          "Pipeline multi-modèle traditionnel, prend en charge plusieurs langues, sans hallucination.",
        VlmEngine: "vlm-engine",
        VlmEngineDesc:
          "Analyse haute précision par VLM multimodal, prend en charge uniquement le chinois et l'anglais.",
        HybridEngine: "hybrid-engine",
        HybridEngineDesc:
          "Analyse hybride haute précision, prend en charge plusieurs langues.",
      },
      MaxPages: {
        Title: "Pages max de conversion",
      },
      EnableTableRecognition: {
        Title: "Activer la reconnaissance des tableaux",
        Desc: "Lorsque désactivé, les tableaux seront affichés comme des images.",
      },
      EnableInlineFormulaRecognition: {
        Title: "Activer la reconnaissance des formules en ligne",
        Desc: "Lorsque désactivé, les formules en ligne ne seront pas détectées ni analysées.",
      },
      EnableImageAnalysis: {
        Title: "Activer l'analyse d'images",
        Desc: "Lorsque désactivé, les blocs image/graphique conservent leur position mais l'analyse VLM est ignorée.",
      },
      ParseMethod: {
        Title: "Méthode d'analyse",
        Auto: "Déterminé automatiquement selon le type de fichier.",
        Txt: "Utiliser la méthode d'extraction de texte.",
        Ocr: "Utiliser la méthode OCR pour les PDF basés sur des images.",
      },
      OcrLanguage: {
        Title: "Langue OCR",
        Ch: "Chinois, anglais, japonais, chinois traditionnel, latin",
        ChServer: "Chinois, anglais, japonais, chinois traditionnel, latin",
        Korean: "Coréen, anglais",
        Ta: "Tamoul, anglais",
        Te: "Télougou, anglais",
        Ka: "Kannada",
        Th: "Thaï, anglais",
        El: "Grec, anglais",
        Arabic: "Arabe, persan, ourdou, etc.",
        EastSlavic: "Russe, biélorusse, ukrainien, anglais",
        Cyrillic: "Russe, langues cyrilliques",
        Devanagari: "Hindi, marathi, népalais, etc.",
      },
      Effort: {
        Title: "Précision d'analyse",
        Medium: "medium",
        MediumDesc:
          "Analyse plus rapide, équilibrant précision et efficacité. L'analyse d'images/graphiques est désactivée.",
        High: "high",
        HighDesc:
          "Analyse de haute précision avec prise en charge de l'analyse d'images/graphiques, peut prendre plus de temps.",
      },
    },
    FileList: {
      Upload: "Télécharger un fichier",
      ClearAll: "Tout effacer",
      Convert: "Démarrer",
      Stop: "Arrêter",
      Name: "Nom",
      Size: "Taille",
      StatusLabel: "Statut",
      Status: {
        pending: "En attente",
        converting: "Conversion en cours",
        success: "Terminé",
        error: "Échec",
      },
      Delete: "Supprimer",
      AccessCodeError: "Code d'accès incorrect !",
      DragDropHint: "Déposez les fichiers ici pour les télécharger",
      ActionsLabel: "Actions",
      DownloadAll: "Empaqueter et télécharger",
      Packaging: "Empaquetage",
      ErrorInfo: "Info erreur",
      UnknownError: "Erreur inconnue",
      LogPlaceholder: "Le journal de conversion apparaîtra ici",
    },
  },
};

export default fr;
