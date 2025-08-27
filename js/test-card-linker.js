/**
 * Test Card Audio Linker
 * Script de test pour vérifier le fonctionnement du système de liaison audio-animations
 */

class CardAudioLinkerTest {
    constructor() {
        this.testResults = {
            audioVisualizer: false,
            cardLinker: false,
            cards: 0,
            audioData: false,
            events: false
        };
        
        this.runTests();
    }

    runTests() {
        console.log('🧪 Démarrage des tests CardAudioLinker...');
        
        // Test 1: Vérifier que AudioVisualizer est initialisé
        this.testAudioVisualizer();
        
        // Test 2: Vérifier que CardAudioLinker est initialisé
        this.testCardAudioLinker();
        
        // Test 3: Vérifier que les cartes sont trouvées
        this.testCardsDetection();
        
        // Test 4: Vérifier les données audio
        this.testAudioData();
        
        // Test 5: Vérifier les événements
        this.testEvents();
        
        // Afficher les résultats
        this.displayResults();
    }

    testAudioVisualizer() {
        console.log('📊 Test AudioVisualizer...');
        
        if (window.audioVisualizer) {
            this.testResults.audioVisualizer = true;
            console.log('✅ AudioVisualizer trouvé');
            
            // Vérifier les méthodes essentielles
            const methods = ['getAudioData', 'getIsPlaying', 'play', 'pause'];
            const missingMethods = methods.filter(method => !window.audioVisualizer[method]);
            
            if (missingMethods.length === 0) {
                console.log('✅ Toutes les méthodes AudioVisualizer disponibles');
            } else {
                console.warn('⚠️ Méthodes manquantes:', missingMethods);
            }
        } else {
            console.error('❌ AudioVisualizer non trouvé');
        }
    }

    testCardAudioLinker() {
        console.log('🔗 Test CardAudioLinker...');
        
        if (window.cardAudioLinker) {
            this.testResults.cardLinker = true;
            console.log('✅ CardAudioLinker trouvé');
            
            // Vérifier les méthodes essentielles
            const methods = ['getAudioData', 'isAudioActive', 'activateCards', 'deactivateCards'];
            const missingMethods = methods.filter(method => !window.cardAudioLinker[method]);
            
            if (missingMethods.length === 0) {
                console.log('✅ Toutes les méthodes CardAudioLinker disponibles');
            } else {
                console.warn('⚠️ Méthodes manquantes:', missingMethods);
            }
        } else {
            console.error('❌ CardAudioLinker non trouvé');
        }
    }

    testCardsDetection() {
        console.log('🎴 Test détection des cartes...');
        
        const cardSelectors = [
            '[data-animation="geometric"]',
            '[data-animation="audioBars"]',
            '[data-animation="circular"]',
            '[data-animation="matrix"]',
            '[data-animation="fireworks"]',
            '[data-animation="dna"]',
            '[data-animation="fractal"]'
        ];

        const foundCards = cardSelectors.filter(selector => 
            document.querySelector(selector)
        );

        this.testResults.cards = foundCards.length;
        
        if (foundCards.length > 0) {
            console.log(`✅ ${foundCards.length} cartes trouvées:`, foundCards);
        } else {
            console.error('❌ Aucune carte trouvée');
        }
    }

    testAudioData() {
        console.log('🎵 Test données audio...');
        
        if (window.audioVisualizer) {
            try {
                const audioData = window.audioVisualizer.getAudioData();
                
                if (audioData && typeof audioData === 'object') {
                    this.testResults.audioData = true;
                    console.log('✅ Données audio disponibles:', audioData);
                    
                    // Vérifier la structure des données
                    const requiredKeys = ['bass', 'mid', 'high', 'overall'];
                    const missingKeys = requiredKeys.filter(key => !(key in audioData));
                    
                    if (missingKeys.length === 0) {
                        console.log('✅ Structure des données audio correcte');
                    } else {
                        console.warn('⚠️ Clés manquantes dans les données audio:', missingKeys);
                    }
                } else {
                    console.error('❌ Données audio invalides');
                }
            } catch (error) {
                console.error('❌ Erreur lors de la récupération des données audio:', error);
            }
        } else {
            console.error('❌ AudioVisualizer non disponible pour tester les données audio');
        }
    }

    testEvents() {
        console.log('🎯 Test événements...');
        
        if (window.audioVisualizer && window.audioVisualizer.addEventListener) {
            this.testResults.events = true;
            console.log('✅ Système d\'événements disponible');
            
            // Tester l'ajout d'un événement
            try {
                const testCallback = () => console.log('Test event triggered');
                window.audioVisualizer.addEventListener('test', testCallback);
                window.audioVisualizer.removeEventListener('test', testCallback);
                console.log('✅ Ajout/suppression d\'événements fonctionnel');
            } catch (error) {
                console.error('❌ Erreur lors du test des événements:', error);
            }
        } else {
            console.error('❌ Système d\'événements non disponible');
        }
    }

    displayResults() {
        console.log('\n📋 RÉSULTATS DES TESTS');
        console.log('========================');
        
        const results = [
            { name: 'AudioVisualizer', status: this.testResults.audioVisualizer },
            { name: 'CardAudioLinker', status: this.testResults.cardLinker },
            { name: 'Cartes détectées', status: this.testResults.cards > 0, value: this.testResults.cards },
            { name: 'Données audio', status: this.testResults.audioData },
            { name: 'Événements', status: this.testResults.events }
        ];

        results.forEach(result => {
            const icon = result.status ? '✅' : '❌';
            const value = result.value ? ` (${result.value})` : '';
            console.log(`${icon} ${result.name}${value}`);
        });

        const successCount = results.filter(r => r.status).length;
        const totalCount = results.length;
        
        console.log(`\n📊 Score: ${successCount}/${totalCount} tests réussis`);
        
        if (successCount === totalCount) {
            console.log('🎉 Tous les tests sont passés ! Le système est prêt.');
        } else {
            console.log('⚠️ Certains tests ont échoué. Vérifiez la configuration.');
        }
    }

    // Méthode pour tester manuellement les animations
    testManualAnimations() {
        console.log('🎨 Test manuel des animations...');
        
        if (!window.cardAudioLinker) {
            console.error('❌ CardAudioLinker non disponible');
            return;
        }

        // Simuler des données audio
        const testAudioData = {
            bass: 0.8,
            mid: 0.6,
            high: 0.4,
            overall: 0.7
        };

        // Appliquer les animations de test
        window.cardAudioLinker.cards.forEach((cardData, type) => {
            console.log(`🎭 Test animation pour ${type}...`);
            
            // Simuler une animation
            const card = cardData.element;
            card.style.transform = 'scale(1.2) rotate(45deg)';
            card.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))';
            
            // Remettre à zéro après 2 secondes
            setTimeout(() => {
                card.style.transform = '';
                card.style.filter = '';
            }, 2000);
        });
    }
}

// Initialiser les tests quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que tous les systèmes soient initialisés
    setTimeout(() => {
        window.cardAudioLinkerTest = new CardAudioLinkerTest();
        
        // Ajouter une commande de test manuel dans la console
        console.log('\n💡 Pour tester manuellement les animations, tapez:');
        console.log('cardAudioLinkerTest.testManualAnimations()');
    }, 2000);
});

// Export pour utilisation modulaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardAudioLinkerTest;
}
